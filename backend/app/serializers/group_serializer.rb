class GroupSerializer
  include JSONAPI::Serializer
  attributes :id, :name

  attribute :owner do |group|
    {
      id: group.owner_id,
      name: group.owner.name
    }
  end

  attributes :created_at, :updated_at
end
