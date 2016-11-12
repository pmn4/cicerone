require 'delegate'
require 'sendgrid-ruby'

require_relative '../models/send_confirmation'

module Services
  class EmailError < StandardError; end

  class EmailAddressFormatter < SimpleDelegator
    alias user __getobj__

    def address
      return nil if user.nil?

      return user.email
      # @todo:
      # return user.email unless user.full_name.present?

      # "#{ user.full_name } <#{ user.email }>"
    end
  end

  class Notification < SimpleDelegator
    DEFAULT_FROM_ADDRESS = 'pat@brewline.io'.freeze

    def send!
      self.class.client.send(compose_mail)
        .tap { |r| store_response(r) }
    rescue Faraday::ClientError => e
      logger.error e.message
      logger.error e.backtrace.join("\n  ")

      raise EmailError, 'Failed to send email'
    end

    def send
      send!
    rescue EmailError
      # noop (error has already been logged)
    end

    # protected

    def compose_mail
      SendGrid::Mail.new({
        to: recipient_address,
        from: sender_address || DEFAULT_FROM_ADDRESS,
        reply_to: sender.email || DEFAULT_FROM_ADDRESS,
        subject: subject,
        text: body_text,
        html: body_html,
        smtpapi: smtp_meta
      })
    end

    def recipient
      raise NotImplementedError
    end

    def recipient_address
      EmailAddressFormatter.new(recipient).address
    end

    def sender
      raise NotImplementedError
    end

    def sender_address
      EmailAddressFormatter.new(sender).address
    end

    def subject
      raise NotImplementedError
    end

    def body_text
      raise NotImplementedError
    end

    def body_html
      body_text
    end

    def categories
      [
        self.class.name.split('::').last,
        __getobj__.class.name.split('::').last
      ]
    end

    def substitutions
      {
        # '%venue%' => [
        #   venue
        # ],
        # '%sender_name%' => [
        #   sender_first_name
        # ],
        # '%tag_line%' => [
        #   tag_line
        # ],
        # '%cta_url%' => [
        #   cta_url
        # ],
        # '%cta_text%' => [
        #   cta_text
        # ],
        # '%cta_duration%' => [
        #   cta_duration
        # ]
      }
    end

    def template_id
    end

    def smtp_meta
      header = Smtpapi::Header.new

      # ADD THE CATEGORIES
      header.set_categories(categories)

      # ADD THE SUBSTITUTION VALUES
      header.set_substitutions(substitutions)

      # ADD THE APP FILTERS
      filters = {
        clicktrack: {
          settings: {
            enable: '1'
          }
        },
        dkim: {
          settings: {
            use_from: '0',
            domain: 'email.brewline.io'
          }
        },
        # ganalytics: {
        #   settings: {
        #     enable: '0',
        #     utm_source: '',
        #     utm_medium: '',
        #     utm_term: '',
        #     utm_content: '',
        #     utm_campaign: ''
        #   }
        # },
        opentrack: {
          settings: {
            enable: '1'
          }
        }
      }

      if template_id.present?
        filters[:templates] = {
          settings: {
            enable: '1',
            template_id: template_id
          }
        }
      end

      header.set_filters(filters)

      header
    end

    private

    def store_response(response)
      Models::SendConfirmation.create!({
        from: sender,
        to: recipient,
        categories: categories.join(','),
        body_json: response.body.to_json,
        headers: response.headers,
        status: response.code,
        subject: subject
      })
    rescue => e
      logger.error e.message
      logger.error e.backtrace.join("\n".freeze)
    end

    class << self
      alias factory new

      cattr_accessor :_client

      def client
        self._client ||= SendGrid::Client.new do |mail_client|
          mail_client.api_key = ENV['SENDGRID_API_KEY']
        end
      end
    end
  end
end
