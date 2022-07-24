import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import InvestmentModel from "../Models/InvestmentModel";

class InvestmentService{

    DocumentToInvestment(data: QueryDocumentSnapshot<DocumentData>){
        return new InvestmentModel(data.data().investment, data.data().investmentType, data.data().price); 
    }

}

export default InvestmentService;
