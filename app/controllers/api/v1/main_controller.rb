module Api::V1
  class MainController < ApiController
    respond_to :json
    def index
      csv_text = File.read(Rails.root.join('public/session_history.csv'))
      csv = CSV.new(csv_text, headers: true, header_converters: :symbol, converters: :all)
      render json: csv.to_a.map {|row| row.to_hash }, root: false
    end
  end
end