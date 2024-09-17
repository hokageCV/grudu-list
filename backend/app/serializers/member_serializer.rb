class MemberSerializer
  include JSONAPI::Serializer
  attributes :id, :email

  attribute :role do |user, params|
    group = params[:group]
    membership = Membership.find_by(user:, group:)
    membership&.role
  end
end
