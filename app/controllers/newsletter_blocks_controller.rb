require_relative '../models/newsletter_block'

class NewsletterBlocksController < ApplicationController
  self.model_class = NewsletterBlock
  self.resource_param = :newsletter_block

  def show
    respond_with newsletter.blocks.find(params[:id])
  end

  def create
    resource = create_block(resource_params)

    newsletter.newsletter_blocks << resource

    # @todo: figure this out
    # respond_with resource.as_json(as_json_options)
    render(json: resource.as_json(as_json_options))
  end

  protected

  def newsletter
    @newsletter ||= Newsletter.find(params[:newsletter_id])
  end

  def create_block(resource_params)
    self.class.model_class.new(resource_params)
  end
end

class BeerNewsletterBlocksController < NewsletterBlocksController
  self.model_class = BeerNewsletterBlock
  self.resource_param = :newsletter_block

  def create_block(resource_params)
    self.class.model_class.new(resource_params).tap do |resource|
      resource.beer =
        Beer.find_or_create_by_key(params[self.class.resource_param][:beer_key])
    end
  end
end

class ContentNewsletterBlocksController < NewsletterBlocksController
  self.model_class = ContentNewsletterBlock
  self.resource_param = :newsletter_block
end
