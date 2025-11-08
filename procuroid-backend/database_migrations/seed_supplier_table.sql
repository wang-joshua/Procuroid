INSERT INTO supplier_database (
  company_name, contact_person, email, phone_number, address, country, website, image_url,
  supplier_type, category, product_keywords,
  product_certifications, min_order_quantity, delivery_regions, average_lead_time,
  currency, typical_unit_price, negotiation_flexibility, preferred_contact_method, active
) VALUES
('TechNova Manufacturing', 'Alice Brown', 'alice@technova.com', '+1-202-555-0147', '1200 Industrial Way, Austin, TX', 'USA', 'https://technova.com', 'https://picsum.photos/seed/technova/200', 'manufacturer', 'Electronics', ARRAY['hub','adapter','usb'], ARRAY['ISO','CE'], 100, ARRAY['North America','Europe'], '14 days', 'USD', 45.50, 'medium', 'email', TRUE),

('GlobalChem Industries', 'Rajesh Kumar', 'rajesh@globalchem.com', '+91-98123-45678', 'Plot 22, Industrial Area, Mumbai', 'India', 'https://globalchem.com', 'https://picsum.photos/seed/globalchem/200', 'manufacturer', 'Chemicals', ARRAY['solvent','adhesive','coating'], ARRAY['ISO'], 200, ARRAY['Asia','Europe'], '21 days', 'USD', 75.00, 'low', 'email', TRUE),

('GreenLeaf Packaging', 'Maria Gonzalez', 'maria@greenleafpack.com', '+34-612-998-332', 'Calle Verde 10, Madrid', 'Spain', 'https://greenleafpack.com', 'https://picsum.photos/seed/greenleaf/200', 'service_provider', 'Packaging', ARRAY['eco-pack','bioplastic'], ARRAY['RoHS'], 500, ARRAY['Europe'], '10 days', 'EUR', 12.50, 'high', 'both', TRUE),

('NextGen Components', 'Tom Wright', 'tom@nextgenparts.com', '+44-20-8899-1122', '24 Baker Street, London', 'UK', 'https://nextgenparts.com', 'https://picsum.photos/seed/nextgen/200', 'distributor', 'Electronics', ARRAY['chip','resistor','sensor'], ARRAY['CE'], 50, ARRAY['Europe','Asia'], '12 days', 'GBP', 8.20, 'medium', 'email', TRUE),

('AutoFlex Systems', 'Linda Chang', 'linda@autoflex.com', '+1-310-555-0199', '5000 Motor Blvd, Detroit, MI', 'USA', 'https://autoflex.com', 'https://picsum.photos/seed/autoflex/200', 'manufacturer', 'Automotive', ARRAY['brake','filter','sensor'], ARRAY['ISO','TS16949'], 1000, ARRAY['North America'], '20 days', 'USD', 35.00, 'low', 'phone', TRUE),

('BlueOcean Logistics', 'Mark Jensen', 'mark@blueoceanlogistics.com', '+45-22-554-882', 'Dock 12, Copenhagen Port', 'Denmark', 'https://blueoceanlogistics.com', 'https://picsum.photos/seed/blueocean/200', 'service_provider', 'Logistics', ARRAY['shipping','warehousing'], ARRAY['ISO'], 0, ARRAY['Europe','Asia'], '7 days', 'EUR', 0.00, 'high', 'email', TRUE),

('NanoTech Electronics', 'Sarah Lee', 'sarah@nanotech.com', '+82-10-2212-3321', '22-3 Seoul Tech Park', 'South Korea', 'https://nanotech.com', 'https://picsum.photos/seed/nanotech/200', 'manufacturer', 'Electronics', ARRAY['transistor','circuit','pcb'], ARRAY['CE','RoHS'], 150, ARRAY['Asia','North America'], '18 days', 'USD', 15.00, 'medium', 'email', TRUE),

('EcoBuild Solutions', 'Carlos Mendes', 'carlos@ecobuild.com', '+351-912-334-221', 'Rua Nova 18, Lisbon', 'Portugal', 'https://ecobuild.com', 'https://picsum.photos/seed/ecobuild/200', 'manufacturer', 'Construction', ARRAY['cement','panel','insulation'], ARRAY['ISO'], 1000, ARRAY['Europe','Africa'], '30 days', 'EUR', 110.00, 'low', 'phone', TRUE),

('AeroLink Supplies', 'David Green', 'david@aerolink.com', '+1-415-555-1234', '220 Sky Ave, Seattle, WA', 'USA', 'https://aerolink.com', 'https://picsum.photos/seed/aerolink/200', 'distributor', 'Aerospace', ARRAY['bolt','wing','engine part'], ARRAY['AS9100'], 500, ARRAY['North America'], '25 days', 'USD', 90.00, 'medium', 'email', TRUE),

('MediCore Labs', 'Dr. Olivia White', 'olivia@medicorelabs.com', '+49-171-882-9911', 'Kaiserstrasse 55, Berlin', 'Germany', 'https://medicorelabs.com', 'https://picsum.photos/seed/medicore/200', 'manufacturer', 'Medical', ARRAY['gloves','mask','sanitizer'], ARRAY['ISO','CE'], 1000, ARRAY['Europe','North America'], '15 days', 'EUR', 2.75, 'high', 'both', TRUE),

('PolyWorks Industries', 'Henry Carter', 'henry@polyworks.com', '+1-222-555-8877', '88 Plastic Rd, Chicago, IL', 'USA', 'https://polyworks.com', 'https://picsum.photos/seed/polyworks/200', 'manufacturer', 'Plastics', ARRAY['polyethylene','polypropylene'], ARRAY['RoHS'], 2000, ARRAY['North America','Asia'], '22 days', 'USD', 1.90, 'medium', 'email', TRUE),

('Quantum Circuits', 'Lina Park', 'lina@quantumcircuits.com', '+82-10-7744-3211', 'Seoul Tech Valley, Bldg 3', 'South Korea', 'https://quantumcircuits.com', 'https://picsum.photos/seed/quantum/200', 'manufacturer', 'Electronics', ARRAY['microchip','IC','transistor'], ARRAY['ISO','CE'], 100, ARRAY['Asia','Europe'], '16 days', 'USD', 28.00, 'medium', 'email', TRUE),

('BrightMetal Works', 'Anand Sharma', 'anand@brightmetal.com', '+91-99223-44211', 'Plot 88, Indore Industrial Estate', 'India', 'https://brightmetal.com', 'https://picsum.photos/seed/brightmetal/200', 'manufacturer', 'Metals', ARRAY['steel','iron','aluminum'], ARRAY['ISO'], 500, ARRAY['Asia','Middle East'], '18 days', 'USD', 65.00, 'low', 'phone', TRUE),

('PurePack Industries', 'Emma Wilson', 'emma@purepack.com', '+61-411-223-110', '55 Clean St, Sydney', 'Australia', 'https://purepack.com', 'https://picsum.photos/seed/purepack/200', 'service_provider', 'Packaging', ARRAY['bottle','container'], ARRAY['CE'], 1000, ARRAY['Oceania','Asia'], '14 days', 'AUD', 0.95, 'medium', 'email', TRUE),

('AgroPrime Supplies', 'Noah Davis', 'noah@agroprime.com', '+27-82-334-9911', 'Plot 12, Cape Town Industrial Zone', 'South Africa', 'https://agroprime.com', 'https://picsum.photos/seed/agroprime/200', 'distributor', 'Agriculture', ARRAY['fertilizer','seed','tractor'], ARRAY['ISO'], 100, ARRAY['Africa','Europe'], '12 days', 'USD', 25.00, 'high', 'email', TRUE),

('Skyline Textiles', 'Jane Doe', 'jane@skytextiles.com', '+1-404-555-7766', '200 Fabric Lane, Atlanta, GA', 'USA', 'https://skytextiles.com', 'https://picsum.photos/seed/skyline/200', 'manufacturer', 'Textiles', ARRAY['cotton','linen','polyester'], ARRAY['ISO'], 300, ARRAY['North America'], '20 days', 'USD', 5.60, 'medium', 'email', TRUE),

('ElectraSmart', 'George Kim', 'george@electrasmart.com', '+82-10-9988-2211', 'Tech Valley 99, Seoul', 'South Korea', 'https://electrasmart.com', 'https://picsum.photos/seed/electrasmart/200', 'distributor', 'Electronics', ARRAY['charger','battery','adapter'], ARRAY['CE'], 200, ARRAY['Asia','North America'], '9 days', 'USD', 9.90, 'high', 'both', TRUE),

('NovaPrint Solutions', 'Carla Rossi', 'carla@novaprint.com', '+39-331-229-8832', 'Via Roma 22, Milan', 'Italy', 'https://novaprint.com', 'https://picsum.photos/seed/novaprint/200', 'service_provider', 'Printing', ARRAY['label','brochure'], ARRAY['ISO'], 500, ARRAY['Europe'], '8 days', 'EUR', 1.25, 'high', 'email', TRUE),

('HyperTech Robotics', 'Ken Adams', 'ken@hypertech.com', '+1-650-555-2211', '400 Tech Blvd, San Jose, CA', 'USA', 'https://hypertech.com', 'https://picsum.photos/seed/hypertech/200', 'manufacturer', 'Robotics', ARRAY['robot arm','sensor','motor'], ARRAY['ISO','CE'], 20, ARRAY['North America','Europe'], '30 days', 'USD', 450.00, 'low', 'email', TRUE),

('PrimeSolar Energy', 'Ava Li', 'ava@primesolar.com', '+86-139-2211-8833', 'Solar Park 2, Shenzhen', 'China', 'https://primesolar.com', 'https://picsum.photos/seed/primesolar/200', 'manufacturer', 'Energy', ARRAY['solar panel','inverter'], ARRAY['CE','ISO'], 100, ARRAY['Asia','Africa'], '25 days', 'USD', 120.00, 'medium', 'email', TRUE),

('OmniHealth Devices', 'Ethan Patel', 'ethan@omnihealth.com', '+44-7522-334411', 'HealthTech Hub, Manchester', 'UK', 'https://omnihealth.com', 'https://picsum.photos/seed/omnihealth/200', 'distributor', 'Medical', ARRAY['syringe','bandage'], ARRAY['CE'], 1000, ARRAY['Europe'], '10 days', 'GBP', 1.80, 'high', 'email', TRUE),

('AquaPure Filters', 'Julia Smith', 'julia@aquapure.com', '+1-707-555-8899', '22 Clean Water St, Portland, OR', 'USA', 'https://aquapure.com', 'https://picsum.photos/seed/aquapure/200', 'manufacturer', 'Water Systems', ARRAY['filter','purifier'], ARRAY['ISO'], 300, ARRAY['North America'], '12 days', 'USD', 18.50, 'medium', 'phone', TRUE),

('BuildMax Tools', 'Victor Hugo', 'victor@buildmax.com', '+55-21-3344-7788', 'Rua Central 88, Rio de Janeiro', 'Brazil', 'https://buildmax.com', 'https://picsum.photos/seed/buildmax/200', 'manufacturer', 'Tools', ARRAY['hammer','drill','wrench'], ARRAY['ISO'], 200, ARRAY['South America'], '20 days', 'USD', 35.00, 'medium', 'both', TRUE),

('Orion Optics', 'Sophia Turner', 'sophia@orionoptics.com', '+1-408-555-3344', '33 Vision Rd, Palo Alto, CA', 'USA', 'https://orionoptics.com', 'https://picsum.photos/seed/orionoptics/200', 'manufacturer', 'Optics', ARRAY['lens','scope','glass'], ARRAY['ISO','CE'], 150, ARRAY['North America','Europe'], '18 days', 'USD', 65.00, 'low', 'email', TRUE),

('VerdeMachinery', 'Diego Alvarez', 'diego@verdemachinery.com', '+52-55-7788-9911', 'Av. Industrial 7, Mexico City', 'Mexico', 'https://verdemachinery.com', 'https://picsum.photos/seed/verdemachinery/200', 'distributor', 'Machinery', ARRAY['excavator','pump','motor'], ARRAY['ISO'], 10, ARRAY['North America','South America'], '28 days', 'USD', 900.00, 'low', 'phone', TRUE);
