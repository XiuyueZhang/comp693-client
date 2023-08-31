const createAxioErrorHandler = (navigate) => {
    const responseInterceptor = {
        onSuccess: (response) => {
            return response.data
        },
        onError: (error) => {
            const status = error.response.status;
            let message = error.response.data.message;

            switch (status) {
                case 400:
                    alert("Error: " + message);
                    break;
                case 403:
                    message = "Please log in.";
                    break;
                case 429:
                    message = "Too many requests";
                    break;
                case 401:
                    localStorage.clear();
                    navigate("/login");
                    break;
                // Add more cases as needed for other status codes
                default:
                    // Default message if none of the cases match
                    message = "An error occurred.";
                    break;
            }
        },
    };

    return {
        responseInterceptor,
    };
};

export default createAxioErrorHandler;
