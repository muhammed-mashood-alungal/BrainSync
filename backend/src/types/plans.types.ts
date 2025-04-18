export interface IPlans {
    name: string,
    offerPrice : number,
    orginalPrice: number, 
    interval: "monthly" | "yearly",
    features: {title : string , description : string}[],
    isActive: boolean,
    isHighlighted : boolean
}