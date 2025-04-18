export interface IPlans {
    name: string,
    price: number, 
    interval: "monthly" | "yearly",
    features: {title : string , description : string}[],
    isActive: boolean,
    isHighlighted : boolean
    
}