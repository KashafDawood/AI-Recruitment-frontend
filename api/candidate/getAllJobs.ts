import axiosInstance from '../axiosConfig';

export const getAllJobs = async (page: number, limit: number) => {
    try{
        const response = await axiosInstance.get(
            `${process.env.NEXT_PUBLIC_URL}/api/jobs/fetchTenJobs/`, {
                params: {
                    page: page,
                    limit: limit
                }
            }
        );
        return response.data;
    } catch(error){
        throw error;
    }
}