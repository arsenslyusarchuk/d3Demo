require 'spec_helper'

module Api::V1
  class ExceptionsController < ApiController
    def record_not_found
      raise ActiveRecord::RecordNotFound
    end
    def record_not_unique
      raise ActiveRecord::RecordNotUnique.new("blah", nil)
    end
    def forbidden_attributes
      raise ActiveModel::ForbiddenAttributesError
    end
    def standard_error
      raise StandardError
    end
  end
end

describe Api::V1::ExceptionsController, type: :controller do

  before do
    Rails.application.routes.draw do
      namespace :api, defaults: {format: 'json'} do
        namespace :v1 do
          scope 'exceptions' do
            get '/record_not_found' => 'exceptions#record_not_found'
            get '/record_not_unique' => 'exceptions#record_not_unique'
            get '/forbidden_attributes' => 'exceptions#forbidden_attributes'
            get '/standard_error' => 'exceptions#standard_error'
          end
        end
      end
    end
  end

  after do
    # be sure to reload routes after the tests run, otherwise all your
    # other controller specs will fail
    Rails.application.reload_routes!
  end
  describe '#handle_exception' do
    it 'returns ActiveRecord::RecordNotFound' do
      result = oauth_get(page, api_v1_record_not_found_path)
      expect(page.status_code).to be(404)
      expect(result['error']).to eq '404 Not Found'
    end

    it 'returns ActiveRecord::RecordNotUnique' do
      result = oauth_get(page, api_v1_record_not_unique_path)
      expect(page.status_code).to be(400)
      expect(result['error']).to eq '400 Bad Request'
    end

    it 'returns ActiveModel::ForbiddenAttributesError' do
      result = oauth_get(page, api_v1_forbidden_attributes_path)
      expect(page.status_code).to be(422)
      expect(result['error']).to eq '422 Unprocessable Entity'
    end

    it 'returns a Internal Server Error' do
      result = oauth_get(page, api_v1_standard_error_path)
      expect(page.status_code).to be(500)
      expect(result['error']).to eq '500 Internal Server Error'
    end
  end
end
