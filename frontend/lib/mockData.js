export const mockSchemes = [
  { id: "1", name: "PMEGP", ministry: "MSME Ministry", eligibility_score: 83, funding_min: 100000, funding_max: 2500000, deadline: "2026-03-31", required_docs: ["Aadhaar", "Bank Statement", "Project Report", "GST Certificate", "PAN Card"], description: "Prime Minister's Employment Generation Programme supports micro enterprises with credit-linked subsidies for setting up new units in non-farm sector.", status: "open", source_url: "https://www.kviconline.gov.in" },
  { id: "2", name: "MUDRA Yojana", ministry: "Ministry of Finance", eligibility_score: 78, funding_min: 50000, funding_max: 1000000, deadline: "2026-12-31", required_docs: ["Aadhaar", "PAN Card", "Business Plan", "Bank Statement", "Address Proof"], description: "Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises under Shishu, Kishore and Tarun categories.", status: "open", source_url: "https://www.mudra.org.in" },
  { id: "3", name: "Startup India Seed Fund", ministry: "DPIIT", eligibility_score: 71, funding_min: 2000000, funding_max: 20000000, deadline: "2026-06-30", required_docs: ["DPIIT Certificate", "Incorporation Certificate", "Business Plan", "PAN Card", "Bank Statement", "Pitch Deck"], description: "Financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.", status: "open", source_url: "https://seedfund.startupindia.gov.in" },
  { id: "4", name: "Stand-Up India", ministry: "Dept of Financial Services", eligibility_score: 65, funding_min: 1000000, funding_max: 10000000, deadline: "2026-12-31", required_docs: ["Aadhaar", "PAN Card", "Caste Certificate", "Business Plan", "Address Proof", "ITR"], description: "Facilitates bank loans between ₹10 lakh and ₹1 crore to SC/ST and women entrepreneurs for greenfield enterprises.", status: "open", source_url: "https://www.standupmitra.in" },
  { id: "5", name: "CGTMSE", ministry: "MSME Ministry", eligibility_score: 59, funding_min: 1000000, funding_max: 20000000, deadline: "2026-12-31", required_docs: ["Udyam Registration", "PAN Card", "GST Certificate", "Financial Statements", "Project Report", "Bank Statement"], description: "Credit Guarantee Fund Trust provides collateral-free credit facility to MSEs with guarantee coverage up to ₹2 crore.", status: "open", source_url: "https://www.cgtmse.in" },
];

export const mockApplications = [
  { id: "1", scheme_name: "PMEGP", status: "under_review", submitted_at: "2026-01-15", readiness_score: 94 },
  { id: "2", scheme_name: "MUDRA Yojana", status: "draft", submitted_at: null, readiness_score: 60 },
  { id: "3", scheme_name: "Stand-Up India", status: "approved", submitted_at: "2025-11-20", readiness_score: 80 },
  { id: "4", scheme_name: "CGTMSE", status: "funded", submitted_at: "2025-10-05", readiness_score: 100 },
  { id: "5", scheme_name: "Startup India Seed Fund", status: "rejected", submitted_at: "2025-09-12", readiness_score: 45 },
];

export const mockJobs = [
  { id: "1", title: "Production Worker", business: "Ravi Bakery", location: "Adyar, Chennai", pay_min: 10000, pay_max: 14000, funded_by: "PMEGP", skills: ["Food handling", "Packaging", "Quality check"] },
  { id: "2", title: "Machine Operator", business: "Kumar Textiles", location: "T. Nagar, Chennai", pay_min: 12000, pay_max: 18000, funded_by: "MUDRA Yojana", skills: ["Machine operation", "Maintenance", "Safety protocols"] },
  { id: "3", title: "Sales Associate", business: "GreenLeaf Organics", location: "Koramangala, Bangalore", pay_min: 15000, pay_max: 22000, funded_by: "Stand-Up India", skills: ["Sales", "Customer service", "Inventory management"] },
  { id: "4", title: "Delivery Coordinator", business: "FreshBox Foods", location: "Anna Nagar, Chennai", pay_min: 11000, pay_max: 16000, funded_by: "PMEGP", skills: ["Logistics", "Route planning", "Communication"] },
];

export const mockUserMatches = [
  { scheme_id: "1", scheme_name: "PMEGP", eligibility_score: 83, reasoning: "Strong match for MSME in food sector with revenue under ₹25 lakh.", readiness_score: 60, missing_documents: ["Project Report", "GST Certificate"] },
  { scheme_id: "2", scheme_name: "MUDRA Yojana", eligibility_score: 78, reasoning: "Eligible under Kishore category for food processing enterprise.", readiness_score: 80, missing_documents: ["Business Plan"] },
  { scheme_id: "3", scheme_name: "Startup India Seed Fund", eligibility_score: 71, reasoning: "Potential match if DPIIT recognition is obtained.", readiness_score: 33, missing_documents: ["DPIIT Certificate", "Pitch Deck", "Incorporation Certificate", "Business Plan"] },
  { scheme_id: "4", scheme_name: "Stand-Up India", eligibility_score: 65, reasoning: "Eligible for SC/ST or women entrepreneur category.", readiness_score: 50, missing_documents: ["Caste Certificate", "Business Plan", "ITR"] },
  { scheme_id: "5", scheme_name: "CGTMSE", eligibility_score: 59, reasoning: "Collateral-free credit available if Udyam registration is completed.", readiness_score: 33, missing_documents: ["Udyam Registration", "Financial Statements", "GST Certificate", "Project Report"] },
];

export const mockDashboard = {
  top_matches: mockUserMatches,
  total_schemes: 15,
  avg_eligibility: 71.2,
  critical_gaps: ["Project Report", "GST Certificate", "Business Plan", "DPIIT Certificate", "Caste Certificate"],
};

export const mockUserProfile = {
  id: 1,
  name: "Priya Sharma",
  email: "priya@kumarfoods.in",
  entity_type: "msme",
  location: "Chennai",
  industry: "food",
  revenue: 500000,
};

export const documentTypes = [
  "Aadhaar", "PAN Card", "GST Certificate", "Bank Statement",
  "Project Report", "ITR", "MSME Registration", "Udyam Certificate",
  "Business Plan", "Balance Sheet",
];
