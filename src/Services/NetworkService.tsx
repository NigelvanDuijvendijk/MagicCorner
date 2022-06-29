class NetworkService {

    async get(url: string) {
        try{
            const response = await fetch(url);
            return response.json();
        } catch(error){
            console.log(error);
            return [];
        }
    }

    async post(url: string, data: any) {
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.json();
        } catch(error){
            console.log(error);
            return [];
        }
    }

}

export default NetworkService;
