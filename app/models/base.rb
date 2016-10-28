module Base
  module InstanceMethods
    def createable_by?(user, params = {})
      user.present?
    end

    def readable_by?(user)
      return false if user.nil?

      created_by_id == user.id
    end

    def updateable_by?(user, params = {})
      return false if user.nil?

      created_by_id == user.id
    end

    def deletable_by?(user)
      return false if user.nil?

      created_by_id == user.id
    end

    def serializable_hash(options = {})
      options = options.try(:clone) || {}

      excepts = [options[:except]].flatten +
        %i(deleted_at migration_id).freeze

      super(options.merge(except: excepts))
    end
  end

  def self.extended(klass)
    klass.include(InstanceMethods)

    klass.acts_as_paranoid
  end

  def accessible_to(user)
    all
  end

  def inflate(models, key)
    key_id = :"#{ key }_id"
    models = Array(models)

    ids = models.map { |m| m.try(key_id) }.uniq.compact

    resources = find(ids).map { |r| [r.id, r] }.to_h

    models
      .select { |m| m.respond_to?(:"#{ key }=") }
      .each do |model|
        model.send(:"#{ key }=", resources[model.send(key_id)])
      end
  end
end
