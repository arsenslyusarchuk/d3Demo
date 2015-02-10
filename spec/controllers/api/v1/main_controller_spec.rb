require 'spec_helper'

describe Api::V1::MainController, type: :controller do
   describe '#index' do
      it "should parse file contents and return a result" do
         csv_text = File.read(Rails.root.join('public/session_history.csv'))
         csv = CSV.new(csv_text, headers: true, header_converters: :symbol, converters: :all)
         get :index
         expect(response.status).to eq 200
         expect(response.body).to eq((csv.to_a.map {|row| row.to_hash }).to_json)
      end
   end
end