// AG CARS KARIMNAGAR — car list.
// To ADD a car: copy one { ... } block, change the details, give it a new id.
// To DELETE a car: remove its { ... } block.
// Photos: put the .jpg files in the images/ folder and list them under "photos".
const cars = [
  {
    id: 1,
    name: "Maruti Swift VXI 2018",
    make: "Maruti",
    model: "Swift VXI",
    contactPhone: "+91 98XXXXXXXX",
    price: "₹5,20,000",
    year: 2018,
    mileageKm: 62000,
    fuelType: "Petrol",
    transmission: "Manual",
    color: "White",
    location: "Karimnagar",
    status: "AVAILABLE",
    ownerType: "First owner",
    insuranceValid: true,
    tyreCondition: "Good",
    engineCondition: "Excellent",
    accidentHistory: "None",
    description: "Well maintained, single owner, all papers clear.",
    photos: ["images/swift1.jpg", "images/swift2.jpg"]
  },
  {
    id: 2,
    name: "Toyota Innova Crysta 2019",
    make: "Toyota",
    model: "Innova Crysta",
    contactPhone: "+91 98XXXXXXXX",
    price: "₹14,75,000",
    year: 2019,
    mileageKm: 88000,
    fuelType: "Diesel",
    transmission: "Manual",
    color: "Silver",
    location: "Karimnagar",
    status: "AVAILABLE",
    ownerType: "Second owner",
    insuranceValid: true,
    tyreCondition: "Average",
    engineCondition: "Good",
    accidentHistory: "None",
    description: "Spacious family car, service records available.",
    photos: ["images/innova1.jpg"]
  }
];
