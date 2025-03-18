import axiosInstance from '../axiosConfig';

export const getAllJobs = async (page: number, limit: number, filters: Record<string, string>) => {
    try {
        const queryParams: Record<string, string | number> = {
            page,
            limit,
        };

        // If a search filter exists, send it separately
        if (filters.search) {
            queryParams.search = filters.search;
        } else {
            Object.assign(queryParams, filters); // Spread normal filters
        }

        const response = await axiosInstance.get(
            `${process.env.NEXT_PUBLIC_URL}/api/jobs/fetchTenJobs/`, { params: queryParams }
        );
        
        console.log("API Response:", response.data);
        return response.data.results;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};
