class TeachersController < ApplicationController
    before_action :set_teacher, only: [:show, :update, :destroy]

    def index
        teachers = Teacher.all

        render json: {
            message: "ok",
            teachers: teachers
        }
    end 

    def show 
        begin
            render json: {
                message: "ok",
                teacher: @teacher
            }
        rescue ActiveRecord::RecordNotFound
            render json: {
                message: "teacher not found with that ID"
            }, status: 404

        rescue StandardError => e
            render json: {
                message: e.to_s
            }, status: 500
        end
    end

    def create 
        teacher =  Teacher.new teacher_params 

        if teacher.save 
            render json: {
                message: "ok",
                teacher: teacher
            }
        else 
            render json: {
                message: teacher.errors
            }, status: 500
        end
    end

    def update 
        if @teacher.update(teacher_params)
            render json: {
                message: "ok",
                teacher: @teacher
            }
        else 
            render json: {
                message: @teacher.errors
            }, status: 500
        end
    end

    def destroy
        @teacher.destroy
        render json: {
            message: "ok"
        }
    end

    private 

    def set_teacher 
        @teacher = Teacher.find(params[:id])
    end

    def teacher_params
        params.require(:teacher).permit(:name, :photo)
    end
end
