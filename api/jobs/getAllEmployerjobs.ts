import axiosInstance from '../axiosConfig';

export const getAllEmployerJobs = async (page: number, limit: number, username:string, filters: Record<string, string>) => {
    try {
        const queryParams: Record<string, string | number> = { page, limit };

        // Handle search filter separately if provided
        if (filters.search) {
            queryParams.search = filters.search;
        }

        // Merge other filters
        Object.entries(filters).forEach(([key, value]) => {
            if (key !== "search" && value) {
                queryParams[key] = value;
            }
        });

        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_URL}/api/jobs/employers/${username}/`, { params: queryParams }
        );
        
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
    }
};
