export interface IPlans {
    _id : string
    name: string,
    orginalPrice: number, 
    offerPrice : number,
    interval: "monthly" | "yearly",
    features: {title : string , description : string}[],
    isActive: boolean,
    isHighlighted : boolean
    
}

export type IPlanError = {
    name: string
    orginalPrice: string, 
    offerPrice : string,
    interval: string
    features: { title: string; description: string }[]
    isActive: string
    isHighlighted: string
  }