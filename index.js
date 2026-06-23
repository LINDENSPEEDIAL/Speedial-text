const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "1185305807988713";
const VERIFY_TOKEN = "speedial123";

// Log env vars on startup (masked)
console.log("CLAUDE_API_KEY set:", !!CLAUDE_API_KEY);
console.log("WHATSAPP_TOKEN set:", !!WHATSAPP_TOKEN);
console.log("WHATSAPP_TOKEN preview:", WHATSAPP_TOKEN ? WHATSAPP_TOKEN.substring(0, 20) + "..." : "NOT SET");

const DIRECTORY_DATA = `You are the Speedial local directory assistant for the Linden, NJ and surrounding areas community. You help people find local businesses, services, doctors, community resources, and more.

When someone asks for a service or business, search the directory below and provide the name, phone number, and address if available. Be friendly and helpful. If multiple options exist, list them all. If you do not have what they need, apologize and suggest they call the main Speedial number.

DIRECTORY LISTINGS:
- ABA [ABA]: Tel 718-489-9844
- Abbey Ezra [Babysitter]: Tel 908-377-8349
- Abby Bondy [Babysitter]: Tel 917-968-3708
- ABC Mortgage- Mr. Eli Katz [Mortgage]: Tel 347-768-1158
- Able Voltage [Low Voltage]: Tel 718-306-9707
- Abra Dental (Child Smiles) [Dentist]: Tel 908-469-9100, Address: 65 Jefferson Avenue, Elizabeth, NJ 07206
- Access Medical Associates [PCP]: Tel 201-503-0833, Address: 177 N Dean Street, Englewood, NJ 07631 Note: Adult PCP
- Accu Reference Medical Lab [Medical Referrals]: Tel 908-474-1004, Address: 1901 E. Linden Ave, Suite 4, Linden, NJ 07036
- Accurate Diagnostic Labs [Hospitals/ Labs]: Tel 908-441-7710, Address: 27 S Ave W # 2nd, Cranford, NJ 07016
- ACE Walco [Exterminator]: Tel 908-862-3660
- Acelleron [Breast Pump]: Tel 973-738-9800
- Acreage Real Estate [Real Estate Agent]: Tel 347-623-4511
- Advanced Dermatology [Dermatologist]: Tel 908-516-2135, Address: 52 Deforest Avenue, Summit, NJ 070901
- Advanced Therapy Of America OT, Speech [Therapy]: Tel 732-726-0600, Address: 485A U.S. Highway 1 South, #300, Iselin, NJ 08830
- Air flow Dryer Vent Cleaner [Dryer Vent Cleaner]: Tel 347-871-0220
- Aisle One [Grocery]: Tel 973-952-6500, Address: 217 Brook Ave, Passaic, NJ 07055 Shuttles on Tuesday & Wednesday
- Albums by D. Heilbrun [Custom Albums]: Tel 347-889-1928
- Albums by Hindy [Custom Albums]: Tel 929-271-2130
- Aleeza Paris [Clothing]: Tel 917-588-2229
- Alissa [Babysitter]: Tel 908-967-8701
- Aliza Polotsek [Babysitter]: Tel 908-758-6339
- Allison [Babysitter]: Tel 848-250-0504
- Alterations- Mrs. M. E. Teichman [Alterations]: Tel 917-202-1926
- Alterations- S. Tyrnauer [Alterations]: Tel 347-598-2874
- Amboy Orthodontics [Orthodontist]: Tel 732-442-7300, Address: 613 Amboy Avenue, Suite 102, Perth Amboy, NJ 08861
- Amit Alzate [Babysitter]: Tel 908-418-5661
- Appliance Choice [Appliances]: Tel 845-402-1703
- Ariel [Babysitter]: Tel 908-472-4242
- Ashley [Babysitter]: Tel 908-838-2615
- Associates in Eye Care [Optometrist]: Tel 908-687-0330, Address: 900 Stuyvesant Ave, Union, NJ or 155 Morris Ave, Springfield,NJ
- Atara [Babysitter]: Tel 845-653-2212
- Atlantic Imaging Center [Radiologist]: Tel 973- 436-0511, Address: 140 Central Ave, Clark, NJ 07066
- Atlantic Medical Group Gastroenterology- Dr Dovid Moradi [GI]: Tel 973-971-7507, Address: 1125 Route 22, Suite 265, Bridgewater, NJ 08807
- Atlantic Medical Group Primary Care [PCP]: Tel 908-522-3707, Address: 1000 Galloping Hill Road, Union NJ 07083 Note: Adult PCP
- AuDSLP [Audiologist]: Tel 201-773-8962, Address: 1 Broadway, Elmwood Park, NJ 07407
- Avenue Grill & Sushi [Restaurant]: Tel 908-354-6777, Address: 157 Elmora Ave, Elizabeth, NJ
- AvruMEats Catering [Party Planning]: Tel 917-383-7510/ 347-357-9997
- AYM Accounting [Accounting / CPA]: Tel 917-960-1693
- Banquest Mr. Yosef Belkin [Credit Card Processing]: Tel 216-816-7888
- Bayway Medical Center [PCP]: Tel 908-994-1900, Address: 636 Bayway Ave, Elizabeth, NJ 07202
- Bear Foot & Ankle, Dr Adler [Podiatry]: Tel 732-847-2500, Address: 301 Bingham Ave Floor 2, Ocean Township, NJ 07712
- Bella Donna Womens Clothing [Clothing]: Tel 347-436-6688
- Benzion Rosenfeld- Vertical Financials [Bookkeeping]: Tel 917-633-6250
- Bichel [Library]: Tel 347-351-7146, Address: 436 Clark Place, Union
- Bikur Cholim of Lakewood [Medical Referrals]: Tel 732-905-3020
- Blau [Pools]: Tel 917-971-8595
- Blinds Decor [Window Shades]: Tel 845-202-0183
- Blitz Heating & Cooling- (Liftig) Mr. S. Hershkowitz [Heating / Cooling]: Tel 917-599-1365
- Blue Bonnet [Clothing]: Tel 848-205-0301
- Boiler & HVAC Tec- Mr. Brandmark [Boiler Repairs]: Tel 347-603-2499
- Bookshelf [Library]: Tel 908-486-1836, Address: 801 Amherst Rd, backyard entrance
- Boruch Halpern Real Estate [Real Estate Agent]: Tel 908-248-2116
- Brachfeld CPA [Accounting / CPA]: Tel 718-878-6171 Fax: 646-849-4352, Address: 14 Commerce Dr, Suite 307, Cranford, NJ
- Brazen Managment [Housing Management]: Tel 908-944-7244 ext:202
- Breastfeeding Medicine of NJ- Dr Amy Shachter [Frenotomy (Tongue Tied)]: Tel 973-826-9226, Address: 1140 Bloomfield Ave. Suite 216, W Caldwell, NJ 07006
- Bright Star Sapphire Dental [Dentist]: Tel 201-254-2969, Address: 25-15 Broadway, Fair Lawn, NJ 07410
- Brushed Elegance- Mrs. Tzippy Gross [Makeup]: Tel 917-676-4343 Note: Full line of skin care products
- Bubby's Books [Library]: Tel 347-496-9473, Address: 211 Gesner St
- Bug A Boo [Exterminator]: Tel 718-925-2333
- Bug Swatters Exterminater [Exterminator]: Tel 732-994-2911
- Burn Center at Saint Barnabas [Hospitals/ Labs]: Tel 973-322-5924, Address: 94 Old Short Hills Rd, Livingston, NJ 07039
- Butterfly Electrolysis [Electrolysis]: Tel 718-791-1628
- California Salon [Waxing]: Tel 908-925-5666, Address: 712 W St Georges Avenue
- Capital Plus- Mrs. Weinberger [Mortgage]: Tel 347-452-5440
- Car On Call [Car Service]: Tel 908-808-9400
- Carla Dersarkissian [Endodontist]: Tel 908-282-6998, Address: 230 W Jersey St #302, Elizabeth, NJ 07202
- Carlos [Landscapers]: Tel 908-313-0088
- CB Jewels [Jewelry]: Tel 845-826-6651
- Certified Fencing- Mr. Benzion Davidowitz [Fencing]: Tel 347-375-5318
- Chaim Medical Resource [Medical Referrals]: Tel 718-492-8700
- Chair Leader [Chair Rentals]: Tel 732-800-7997
- Chani Weinberger [Babysitter]: Tel 908-380-5722
- Chaya [Babysitter]: Tel 908-344-7979
- Chaya Bernhaut [Babysitter]: Tel 862-323-5720
- Chaya Lighten [Lactation Consultant]: Tel 732-395-7896, Address: 345 Plainfield Avenue, Suite 201, Edison NJ 08817
- CheckMate Solutions [Computer Networking / Repairs]: Tel 347-450-6689
- Chef's Kitchen [Food]: Tel 929-600-CHEF
- Chemed [OB/GYN]: Tel 732-534-8555/ 732-364-2144, Address: RWJ Note: **Direct Medicaid apply thru them to have everything covered
- Child Development Services- Chanie Orgel, M.S.Ed. DIR/Floortime [Child Development Services]: Tel 917-652-2514
- Child Development Services- Shmuel Orgel, M.A., Behavior Analysis [Child Development Services]: Tel 631-438-1825
- Child's Specialty Hospital- OT, PT, Speech [Therapy]: Tel 888-244-5373, Address: 2840 Morris Ave, Union, NJ
- Chill Master [Heating / Cooling]: Tel 908-350-5050
- Chocolate Dreams [Chocolate Arrangements]: Tel 917-656-9437
- Chocolate Dreams [Cheesecakes & Dairy Minitures]: Tel 917-656-9437
- CK Wigs by Mrs. Chaya'la Katz [Wigs]: Tel 347-585-2066 Note: Synthetic Wigs
- Cleaning Power [Carpet Cleaning]: Tel 973-221-3536
- Clutterfly [Organizer]: Tel 718-930-2689
- Coastal Ear, Nose & Throat Dr. Houston & Dr. Engel (Pediatric) [ENT]: Tel 732-280-7855, Address: Few Locations
- Comfort Family Dental [Dentist]: Tel 732-747-7730, Address: 23 White Street, Shrewsbury, NJ 07702
- Commercial Real Estate Broker [Real Estate Agent]: Tel 347-432-3012
- Computer Networking/ Repairs [Computer Networking / Repairs]: Tel 347-623-5721
- Contain It [Organizer]: Tel 718-812-0200
- Cookies n' Creme [Cookies]: Tel 929-271-3299
- Cooper Neurological Institute-Dr. Loretta Mueller [Headache Specialist]: Tel 856-546-8525, Address: 2339 Rt 70 W 4th Fl, Cherry Hill, NJ 08002
- Corner Bite [Food]: Tel 908-350-4422, Address: W St. Georges Ave, Linden, NJ 07036
- Couch Potato [Furniture]: Tel 718-972-7632
- Country Crave Peanut Chews [Chocolate Arrangements]: Tel 347-971-1565
- Craft [Roofing]: Tel 845-280-5775
- Cranford Endodontics [Endodontist]: Tel 908-276-7773, Address: 300 N Ave E, Cranford, NJ 07016 Note: **Private Insurance
- Cricut by Fraidy [Personalized Gifts]: Tel 718-809-5963
- Cricut By Hindy [Personalized Gifts]: Tel 929-271-2130
- Crocheting Lessons/ Kits, Yarn & Supplies- Mrs. R. Brandmark [Crocheting Lessons]: Tel 347-432-3316
- Crown Cleaners [Cleaners]: Tel 908-276-7786, Address: 665 Raritan Rd, Cranford, NJ
- CVS [Pharmacies]: Tel 908-925-0130, Address: 1000 W St Georges Ave, Linden, NJ 07036
- Dance Instructor- Mrs. H. Zionce [Exercise Instructor]: Tel 718-207-2637
- Dash Cam [Dash Cam]: Tel 347-855-3355
- Deck Right [Decks]: Tel 347-436-5447
- Dental Care for Kids [Dentist]: Tel 201-569-KIDS (5437), Address: 180 North Dean St. Suite 1 North, Englewood NJ, 07631
- Dentistry for Children of Lakewood [Dentist]: Tel 732-370-3700, Address: Few Locations
- Designery- Mrs. E. Fuhrer [Graphic Designer]: Tel 718-541-2259
- Devorah Perel Sitko- Dolavender [Doulas]: Tel 347-580-3047, Address: Linden
- Devorah Perel Sitko- Dolavender [Doula]: Tel 347-580-3047, Address: Linden
- Devorah Sprei [Babysitter]: Tel 908-943-3370
- Diamond Braces [Orthodontist]: Tel 908-222-8228, Address: 36 Progress St, Edison, NJ 08820
- Digital Illustrator [Illustrator]: Tel 929-382-0199
- Doodles [Art Classes]: Tel 929-663-7500
- Doula- Mimi Blumenkrantz [Doula]: Tel 732-996-9934, Address: Edison
- Doula- Mimi Blumenkrantz [Doulas]: Tel 732-996-9934, Address: Edison
- Doula- Roizy Silber [Doulas]: Tel 201-923-9239
- Doula- Roizy Silber [Doula]: Tel 201-923-9239
- Dr David Book [Endodontist]: Tel 973-598-1161, Address: 272 US-206 Suite 206, Flanders, NJ 07836
- Dr Elbaum [Endodontist]: Tel 732-264-6114, Address: 1 Bethany Rd Building 4, Suite 51, Hazlet, NJ 07730
- Dr Jason Galante [Podiatry]: Tel 732-388-2375, Address: 1600 St Georges Ave, Rahway, NJ 07065
- Dr Patterson [Orthopedic Oncologist]: Tel 551-996-2533, Address: 20 Prospect Ave #901, Hackensack, NJ 07601
- Dr Ronny Meier [OB/GYN]: Tel 201-385-8350, Address: 35 St Washington Ave, Bergenfield, NJ 07621
- Dr. Aditi M. Kanth [Plastic Surgeon]: Tel 732-235-7865, Address: RJW 125 Paterson St, Suite 3300, New Brunswick, NJ 08903
- Dr. Alice Chu- hand [Orthopedic]: Tel 973-972-2076, Address: 205 S Orange Ave C 1200, Newark, NJ 07103
- Dr. Anthony DeCosta, MD [Chiropractor]: Tel 908-755-1117, Address: 129 S Plainfield Ave, South Plainfield, NJ 07080
- Dr. Avalon [OB/GYN]: Tel 973-998-7822, Address: 25 Lingsley Dr, Morristown, NJ 07055
- Dr. Ayers [OB/GYN]: Tel 732-235-6600, Address: 125 Paterson St, New Brunswick, NJ 08901
- Dr. Barbara Minkowitz- pediatrics [Orthopedic]: Tel 973-206-1033, Address: 261 James St Suite 3C, Morristown, NJ 07960
- Dr. Berg [ENT]: Tel 973-309-7603, Address: 101 Old Short Hills Rd. #520, West Orange, NJ 07052
- Dr. Borowski [PCP]: Tel 908-486-3366, Address: 45 Pearl St, Mutuchen, NJ 08840
- Dr. Bowe [Orthopedic]: Tel 732-390-1160, Address: 585 Cranburry Rd, E. Brunswick, NJ 08816
- Dr. Bral [Dentist]: Tel 201-222-1123, Address: 901 Bergen Avenue, Jersey City, NJ 07306
- Dr. Bressler [ENT]: Tel 973-576-5976, Address: 140 Park Avenue, Florham Park, NJ 07932 Note: **No Insurance
- Dr. Bruce Goldstein [Optometrist]: Tel 908-354-2138, Address: 700 North Broad Street, Elizabeth, NJ
- Dr. Charles Crane [Optometrist]: Tel 973-763-2203, Address: 71 2nd St, South Orange, NJ
- Dr. Cholankeril [PCP]: Tel 908-352-1738, Address: 100 Grove St., Elizabeth, NJ 07202 Note: Adult PCP
- Dr. Chudi Mgbako [Podiatry]: Tel 609-798-7103, Address: 440 Chestnut Street, 2nd Floor, Union, NJ 07013
- Dr. Cohen [ENT]: Tel 973-971-7355, Address: 100 Madison Ave Floor 1, Morristown, NJ 07960
- Dr. Daniel Hakimi [OB/GYN]: Tel 973-471-0707, Address: 905 Allwood Road, Suite 206, Allwood Rd, Clifton, NJ 07012
- Dr. David Konigsberg [Orthopedic]: Tel 201-445-9000, Address: 600 Godwin Ave, Midland Park, NJ 07432
- Dr. Dennis Brenner [Endocrinologist]: Tel 973-322-6900, Address: 375 Mt Pleasant Ave #105, West Orange, NJ 07052
- Dr. Diego Saporta [ENT]: Tel 908-352-6700, Address: 470 N Ave #1, Elizabeth, NJ 07208
- Dr. Effie Zuller [Plastic Surgeon]: Tel 718-871-1111, Address: 667 Myrtle Ave, Brooklyn, NY 11205
- Dr. Eisenberger & Dr. Meister [Orthodontist]: Tel 973-862-3333, Address: 217 Brook Avenue, Suite B104, Passaic, NJ 07055
- Dr. Elbaum [Oral Surgeon]: Tel 732-264-6114, Address: 1 Bethany Rd Building 4, Suite 51, Hazlet, NJ 07730
- Dr. Emily Berger/ Dr. Julie V Schaffer [Dermatologist]: Tel 551-996-8697, Address: 155 Polifly Rd #101, Hackensack, NJ 07601
- Dr. Eric Lieberman GYN Surgeon [OB/GYN]: Tel 973-243-9300, Address: 101 Old Short Hill Road, Suite 400, West Orange, NJ 07052
- Dr. Esral [Dentist]: Tel 908-925-5397, Address: 181 Westfield Ave # 3, Clark, NJ 07066
- Dr. Eun Ho Sheen, MD [Allergist]: Tel 908-925-3318, Address: 926 N Wood Ave, Linden, NJ 07036
- Dr. Fauzia Ahmed (female) [PCP]: Tel 908-925-9100, Address: 822 N Wood Ave Ste 3, Linden, NJ 07036 Note: Adult PCP
- Dr. Frank Barrows [Endocrinologist]: Tel 732-935-7143, Address: 200 Wyckoff Rd, Suite 4200, Eatontown, NJ 07724
- Dr. Frank Ciminello [Neurology]: Tel 201-289-5551, Address: 113 West Essex St, Suite 204, Maywood, NJ 07607
- Dr. Gerald Sciascia, Md [Chiropractor]: Tel 718-448-0687, Address: 1313 Clove Rd, Staten Island, NY 10301
- Dr. Gildin Alexander [Dentist]: Tel 973-685-7180, Address: 145 Main Ave, Passaic, NJ 07055
- Dr. Heather Appelbaum [OB/GYN]: Tel 732-897-3858, Address: 1900 NJ-35, Suite 300, Oakhurst, NJ 07755
- Dr. Herbst [Oral Surgeon]: Tel 201-601-9262, Address: 312 44th St, Union City, NJ 07087
- Dr. Ian J. Langer [Endodontist]: Tel 908-486-6640, Address: 140 St Paul Street, Westfield, NJ 07090
- Dr. Ian Marshall [Endocrinologist]: Tel 732-235-9378, Address: 89 French Street # 2300, New Brunswick, NJ 08901
- Dr. Itzkowitz/ Dr. Tessler [Pediatricians]: Tel 973-591-1600, Address: 145 Main Avenue #203, Passaic, NJ
- Dr. Jacek Grzybowski [Pediatricians]: Tel 908-587-9611, Address: 812 N Wood Avenue, Linden, NJ
- Dr. James E. Haberman [Optometrist]: Tel 908-688-4000, Address: 2333 Morris Ave. Suite C-103, Union, NJ
- Dr. Jay Bernstein [Ophthalmology]: Tel 908-317-9811, Address: 138 S. Euclid Ave, Westfield, NJ 07090
- Dr. Jean Pattathil [PCP]: Tel 908-355-8877, Address: 240 Williamson, Elizabeth, NJ 07202 Note: Adult PCP
- Dr. Jeff Paley & Dr.Doron Katz [PCP]: Tel 201-503-0833, Address: 177 N Dean St, Englewood, NJ 07631 Note: **Private Insurance
- Dr. Jeffrey Weiss, MD [Allergist]: Tel 973-248-9199, Address: 44 State Rt 23, Suite 6, Riverdale, NJ 07457 Note: Make an appt. with Dr. Weiss
- Dr. Jennifer Falcone, MD [Chiropractor]: Tel 718-987-2073, Address: 1235 Forest Hill Rd, Staten Island, NY 10314
- Dr. Joel Mendelson, MD [Allergist]: Tel 973-322-6900, Address: 375 Mt Pleasant Ave Suite 105, West Orange, NJ 07052
- Dr. Joseph D. Fishkin [Optometrist]: Tel 201-383-9140, Address: 800 Kinderkamack Rd, Emerson, NJ
- Dr. Joseph G. Barone [Urologist]: Tel 732-235-7960, Address: 1 Robert Wood Johnson Pl, New Brunswick, NJ 08901
- Dr. Joseph M. Shulman & Dr. Debra Reich- Sobel [PCP]: Tel 908-486-7773, Address: 809 N Wood Ave, Linden, NJ 07036 Note: Adult PCP
- Dr. Joshua Stern [Dentist]: Tel 973-667-9110, Address: 602 Franklin Ave, Nutley, NJ 07110
- Dr. Kelner [Periodontics]: Tel 732-587-6740, Address: 67 Walnut Ave #307, Clark, NJ 07066
- Dr. Kevin Herman [Vascular]: Tel 201-227-6210, Address: 718 Teaneck Rd Interventional Institute, Teaneck, NJ 07666
- Dr. Kimmel [Plastic Surgeon]: Tel 718-832-9488/ 917-692-7668 private number, Address: 112 Prospect Park West, Brooklyn, NY 11215 Note: **Cash
- Dr. Kohn Womens Health Center [OB/GYN]: Tel 201-984-1270, Address: 116 Newark Ave, Jersey City, NJ 07032
- Dr. Kristin L. Brill MD [Breast Surgeon]: Tel 856-218-2100, Address: 2211 Chapel Ave West, Suite 301, Cherry Hill, NJ 08002
- Dr. Kwong [Ear Molds]: Tel 732-235-5530, Address: 10 Plum Street, 8th Floor, New Brunswick, NJ
- Dr. Kwong, Dr. Chandy [ENT]: Tel 732-235-5530, Address: 10 Plum St. 8th Fl, New Brunswick, NJ Note: **Pediatric
- Dr. Lawrence Potochney [Chiropractor]: Tel 908-241-7550, Address: 687 N Wood Ave, Roselle, NJ 07203 Note: **Private Insurance
- Dr. Lebovics [Podiatry]: Tel 908-925-1500, Address: 623 N. Wood Ave, Linden, NJ 07036 Note: **Private Insurance
- Dr. Leonard Eisner [Endodontist]: Tel 732-577-1855, Address: 4251 US-9, Freehold, NJ 07728
- Dr. Leonard J. Press (Prism Specialist) [Optometrist]: Tel 732-569-2136, Address: 1201 River Ave, Lakewood, NJ 08701
- Dr. Levitt [ENT]: Tel 973-731-2100, Address: 769 Northfield Ave, West Orange, NJ 07052
- Dr. Lukanda (M) Dr. Colombo (F) [PCP]: Tel 908-275-3810, Address: 27 S Ave, W Cranford, NJ 07016 Note: Adult PCP
- Dr. Malka [Dentist]: Tel 908-862-2020, Address: 10 N Wood Avenue, Linden, NJ 07036
- Dr. Marc Plotkin [Dentist]: Tel 908-351-2106, Address: 1151 E Jersey St, Elizabeth, NJ 07201
- Dr. Mathias N. Zemel MD [Dermatologist]: Tel 973-279-1232, Address: 381 Chestnut St. Union, NJ 07083
- Dr. Matos [Oral Surgeon]: Tel 908-282-6998, Address: 230 W Jersey St, Suite #302, Elizabeth, NJ 07201
- Dr. Matos [Orthodontist]: Tel 908-354-4428, Address: 440 E Westfield Ave. #3, Roselle Park, NJ 07204
- Dr. Maya R. Ramagopal [Pulmonologist]: Tel 732-235-7899, Address: 89 French St, New Brunswick, NJ 08901
- Dr. Meir Z. Dershowitz [Endocrinologist]: Tel 201-460-0063/ 917-754-8808, Address: 612 Rutherford Ave, Lyndhurst, NJ 07071
- Dr. Michael D. Stifelman [Urologist]: Tel 551-996-8090, Address: 360 Essex St. Suite 403, Hackensack, NJ 07601
- Dr. Michael E. Meininger [GI]: Tel 201-945-6564, Address: 140 Sylvan Ave, Englewood Cliffs, NJ 07632
- Dr. Nancy Herbst [Oral Surgeon]: Tel 908-913-8780, Address: 700 N Broad Street, #2C, Elizabeth. NJ 07208
- Dr. Nivmor [ENT]: Tel 908-795-1194, Address: 550 Central Ave Suite 500, New Providence, NJ 07974
- Dr. Paola A. Escobar [OB/GYN]: Tel 973-747-5217, Address: 141 Passaic Ave, Passaic, NJ
- Dr. Parchment [OB/GYN]: Tel 973-313-2501, Address: 1973 Springfield Avenue, Maplewood, NJ 07040
- Dr. Patricia C. McCormack [Dermatologist]: Tel 908-925-8877, Address: 515 North Wood Ave, Linden, NJ 07036
- Dr. Philip Green,MD [Cardiologist]: Tel 718-266-0900, Address: 177 North Dean Street, Suite 203, Englewood, NJ 07631
- Dr. Rajiv Verma, MD [Cardiologist]: Tel 973-926-3500, Address: 201 Lyons Ave Childrens Hospital of NJ, L-5 Newark, NJ 07112
- Dr. Respler [ENT]: Tel 201-996-9200, Address: 2 S Summit Ave #2, Hackensack, NJ 07601
- Dr. Richard Luka, MD [Allergist]: Tel 732-242-7829, Address: 1139 Raritan Rd, Clark, NJ
- Dr. Richard Schlussel [Urologist]: Tel 201-541-8628, Address: 360 Essex St Suite 402, Hakensack, NJ 07601
- Dr. Robert Greenberger Trinitas [OB/GYN]: Tel 908-282-2000, Address: 225 Williamson St, Elizabeth, NJ 07202 Note: **reach out to any of these and the head of the OB dept will call back
- Dr. Rubinstein [PCP]: Tel 908-587-9300, Address: 520 N Wood Avenue, Linden, NJ 07036
- Dr. Rutner [Oral Surgeon]: Tel 908-654-6030, Address: 552 Westfield Ave, Westfield, NJ 07090
- Dr. S. Rafulo [Optometrist]: Tel 908-755-2101, Address: 160 E 2nd St, Plainfield, NJ
- Dr. Samiappan Muthusamy [GI]: Tel 908-688-6565, Address: 695 Chestnut St, Union, NJ 07083
- Dr. Sara Kader [Audiologist]: Tel 732-324-5030, Address: 3 Hospital Plaza Suite 417, Old Bridge, NJ 08857
- Dr. Sarah Krause [Dentist]: Tel 908-897-0962, Address: 626 Chestnut St, Union, NJ 07083
- Dr. Schanzer [Neuro Ophthalmology]: Tel 732-548-0770, Address: 1812 Oak Tree Rd, Edison, NJ 08820
- Dr. Schwartz/ Dr. Bloom [Orthopedic]: Tel 973-538-7700, Address: 609 Morris Ave 2nd Fl, Springfield, NJ 07081
- Dr. Shaulov [Neurology]: Tel 973-972-9106, Address: 90 Bergen St, Newark, NJ 07103
- Dr. Sheldon S. Lin [Orthopedic]: Tel 973-972-2184, Address: 205 S Orange Avenue, C1200, Newark, NJ 07103
- Dr. Simona Horak Nativ [Rheumatologist]: Tel 973-971-4096, Address: 100 Madison Avenue, Morristown, NJ 07960
- Dr. Smati [ENT]: Tel 201-996-1505, Address: 10 Forest Ave, Paramus, NJ
- Dr. Smati Greenfeld [Hearing Dr.]: Tel 732-574-3550, Address: 49 Brant Ave, Clark, NJ 07960
- Dr. Stephen L. Winters, MD [Cardiologist]: Tel 973-971-4261, Address: 100 Madison Ave, Morristown, NJ 07960
- Dr. Steven Brant [GI]: Tel 732-235-7784, Address: 125 Paterson Street,  New Brunswick, NJ 08901
- Dr. Steven M. Elias [Vascular]: Tel 201-894-3252, Address: 350 Engle St 3rd Floor, Englewood, NJ 07631
- Dr. Steven Y. Tennenbaum [Urologist]: Tel 201-692-9550, Address: 699 Teaneck Rd #103, Teaneck, NJ 07666
- Dr. Tamara L Feldman [GI]: Tel 973-971-5676, Address: 55 Madison Avenue Second Floor, Morristown, NJ 07960
- Dr. Tamir Bloom [Orthopedic]: Tel 973-538-7700, Address: 609 Morris Ave. 2nd Floor, Springfield, NJ 07081
- Dr. Thomas McPartland [Orthopedic]: Tel 732-390-1160/ 732-390-8449, Address: 585 Cranbury Rd, E Brunswick, NJ 08816
- Dr. Todd Stevens [Podiatry]: Tel 908-687-5757, Address: 318 Chestnut St, Roselle Park, NJ 07204
- Dr. Varshneya, MD [Cardiologist]: Tel 732-396-0080, Address: 1103 Westfield Ave, Rahway, NJ 07065
- Dr. Verma, MD [Cardiologist/ Pediatric]: Tel 973-926-3500, Address: 102 James St. Suite 102, Edison, NJ 08820
- Dr. Victoriya Staab [General Surgeon Pediatric]: Tel 732-935-0407, Address: 19 Davis Ave, 4th floor, Neptune City, NJ 07753
- Dr. Vincent Carrao [Oral Surgeon]: Tel 201-585-8282, Address: 1530 Palisade Ave, Fort Lee, NJ 070245471
- Dr. Vincent R. Vicci (Prism Specialist) [Optometrist]: Tel 908-654-7950, Address: 592 Springfield Ave Westfield New Jersey  07090
- Dr.Robbert Pittman [GI]: Tel 201-967-8221, Address: 466 Old Hook Rd STE 1, Emerson, NJ 07630 Note: **Aetna Better Health
- Dream Home Builders [Construction]: Tel 347-343-8282
- Dry Goods- Mr. Basics- Staten Island [Clothing]: Tel 718-851-1799 Note: Men's and boys basics and dry goods Staten Island
- Dynamic Foot & Ankle Podiatry- Dr Kaitlin Gonzales [Podiatry]: Tel 908-280-4314, Address: 776 E 3rd Ave, Cranford, NJ 07203
- E-Z Parties [Chair Rentals]: Tel 732-496-2030
- Ear Piercing by Mrs. Chaya'la Mandel [Ear Piercing]: Tel 917-627-4339
- Early Intervention [Therapy]: Tel 888-653-4463
- Eastern Dental of Parlin [Dentist]: Tel 732-707-6654, Address: 2909 Washington Rd Suite 135, Parlin, NJ 08859
- Eastern Dental of Woodbridge [Dentist]: Tel 732-538-8726, Address: 1030 St Georges Ave, Avenel, NJ 07001
- Eleanor [Babysitter]: Tel 347-339-8183
- Eli's Appliance [Appliances]: Tel 201-801-1001
- Elias [Pools]: Tel 718-753-0141 Note: Beautiful Heated Pool available by the hour. Bathroom on premises
- Elite Painters [Painter]: Tel 917-806-7079
- Elizabeth NJ Med [PCP]: Tel 908-355-8877, Address: 240 Williamson St. Suite 204, Elizabeth, NJ 07202
- Elizabeth One Stop Kosher [Grocery]: Tel 908-354-0448, Address: 115 Elmora Ave Elizabeth, NJ
- Elysha Schwartz [Stitches]: Tel 929-322-4480, Address: 7 Washington Ave, Staten Island, NY
- Embroidery [Embroidery]: Tel 718-930-8991
- Emerald Dental Spa [Dentist]: Tel 862-347-3239, Address: 397 Chestnut St, #1, Union, NJ 07083
- Endocrinology Constultants [Endocrinologist]: Tel 201-567-8999, Address: 229/ 221/199 Engle St, Englewood, NJ 07631
- Esther [Babysitter]: Tel 908-477-0801
- Everest Chiropractic [Chiropractor]: Tel 646-688-5772, Address: 57 W 57 St, Suite 1003, New York, NY 10019
- Exploy Outsourcing [Outsourcing]: Tel 347-557-9797
- Eye Center of Clark [Optometrist]: Tel 732-381-3113, Address: 86 Westfield Ave, Clark, NJ 07066 Note: **Takes straight medicaid
- Eye Works [Optometrist]: Tel 908-486-5050, Address: 1025 W St. Georges Ave, Linden, NJ 07036
- Eyes on You [Optometrist]: Tel 732-650-3090, Address: 1535 Ivering St, Rahway, NJ
- Ez Benefits Mr. Waldmen [Health]: Tel 732-569-4775
- Family Eye Care [Optometrist]: Tel 908-259-5059, Address: 515 N. Wood Ave. Suite 102, Linden, NJ 07036
- Family Pharmacy [Pharmacies]: Tel 908-925-4567, Address: 332 W St Georges Ave, Linden, NJ 07036
- Femary [Lingerie]: Tel 908-460-6066 Note: Call/ Text for appt.
- Flix Handyman [Handyman]: Tel 855-289-8989
- Floortime Therapist- Raizy Aronowitz [Child Development Services]: Tel 845-548-0136
- Forever Living [Health]: Tel 917-803-4591
- Forever Living by Mrs. Teitelbaum [Health]: Tel 347-423-0118
- Forever Living Products by Mrs. D. Heilbrun [Health]: Tel 347-889-1928
- Four Star Funding- Mr. Shauly Friedman [Mortgage]: Tel 347-683-0205
- Four Star Funding- Mr. Y. M. Zenwirth [Mortgage]: Tel 646-951-3785
- Freddy [Landscapers]: Tel 732-439-1066
- Fruend's Fish [Fish stores]: Tel 718-438-3773 Note: order placed by 4pm Mon and Wed delivered next morning
- Garden State Dental of Roselle Park Dr. Friedman [Dentist]: Tel 908-279-0621, Address: 263 E Westfield Ave, Roselle Park, NJ 07204
- Garden State Urology [Urologist]: Tel 973-539-0333, Address: 261 James St #1a, Morristown, NJ 07960
- Gershon [Plumber]: Tel 216-401-8748
- Giddy's Pizzeria [Restaurant]: Tel 732-659-6898, Address: East Brunswick, Deliveries available
- Gifted [Gifts]: Tel 347-675-7837
- Glucks Insurance Agency [Insurance]: Tel 845-362-8689
- Gold Star Restoration [Restoration]: Tel 877-95WATER
- Goldberg's [Grocery]: Tel 718-435-7177 Note: Call or email before 11 Monday & Wednesday
- Gown Exchange [Clothing]: Tel 347-835-1366
- Grand View Plumbing [Plumbing Supply]: Tel 908-280-2800
- Greens Creams [Health]: Tel 347-907-1386
- Growing Faces Pediatric Dentistry [Dentist]: Tel 732-375-1000, Address: 799 Amboy Ave, Edison, NJ 08837
- Growing Faces Pediatric Dentistry- Dr Naomi Hillel [Frenotomy (Tongue Tied)]: Tel 732-375-1000, Address: 799 Amboy Ave, Edison, NJ 08837
- Gruenwald & Comandatore [Pediatricians]: Tel 973-378-7990, Address: 90 Millburn Avenue, Suite 101, Millburn, NJ 07041
- Hackensack University Medical Center [Hospitals/ Labs]: Tel 551-996-2000, Address: 30 Prospect Ave, Hackensack, NJ 07601
- Hair by Henchy Schlafrig [Hair]: Tel 908-486-0430
- Hair by Malky Gottlieb [Hair]: Tel 908-545-0727
- Hair by Mrs. Gitty Frankel [Hair]: Tel 718-854-1957
- Hair by Mrs. Leah'la Torn [Hair]: Tel 929-366-1949
- Hair by Mrs. M. L. Fisher [Hair]: Tel 908-217-6433
- Hair by Mrs. Malky Horowitz [Hair]: Tel 929-214-0856
- Hair by Raizy Brunner [Hair]: Tel 848-433-0762
- Hair by Rivky Schwartz [Hair]: Tel 908-925-2525
- Haircuts By Mrs. Gitty Einhorn [Hair]: Tel 917-685-7467
- Hand Over Heart [Physical Therapy]: Tel 201-691-7293, Address: 244 Pennington Ave, Passaic, NJ
- Harry B. Schick [Chiropractor]: Tel 732-249-9800, Address: 317 Cleveland Avenue, First Floor, Highland Park, NJ 08904 Note: **Cash
- Hats for Ladies [Hats for Ladies]: Tel 347-304-0421
- Hatzlacha Furniture (Williamsburg) [Furniture]: Tel 718-387-4479
- Hatzlacha Plumbing & Heating [Plumber]: Tel 347-857-7890
- Healing Stones by Ambeez [Health]: Tel 347-388-2811
- Healing Stones by Ambeez [Jewelry]: Tel 347-388-2811
- Hendy Lieber Photography [Photography]: Tel 347-652-5373
- Hindy's Kitchen [Personal Chef]: Tel 929-600-CHEF
- Holy Schnitzel [Restaurant]: Tel 718-761-4659, Address: 438 Nome Ave, Staten Island, NY 10314
- Hopstein [Locksmith]: Tel 917-800-0804
- House of Flowers [Flowers]: Tel 908-486-3344, Address: 650 N Wood Ave, Linden, NJ
- Hudson - Essex Allergy Dr. Mark Weinstein [Allergist]: Tel 973-759-5842, Address: 5 Franklin Ave #102, Belleville, NJ 07109
- Hudson Oral Surgery [Endodontist]: Tel 908-241-2114, Address: 842 E St Georges Ave, Linden, NJ 07036
- Hudson Oral Surgery [Oral Surgeon]: Tel 908-241-2114, Address: 842 E St Georges Ave, Linden, NJ 07036
- Hush Spa [Spa]: Tel 848-354-5098
- Hush Spa [Waxing]: Tel 848-354-5098
- Hyon S. Kim [Endocrinologist]: Tel 732-235-7219, Address: MD125 Paterson Street, Suite 5200, New Brunswick, NJ 08901
- Iconic Wood Flooring [Flooring]: Tel 917-586-1352
- Impact Medical [Allergist]: Tel 201-523-9797, Address: 140 State Route 17 North, Suite 204, Paramus, NJ 07652
- Imprints n Design [Graphic Designer]: Tel 347-314-2356
- Indigo Risk [Insurance]: Tel 718-781-6428
- Innovative Food & Ankle [Podiatry]: Tel 908-276-6624, Address: 528 Boulevard, Kenilworth, NJ 07033
- Innovative Foot and Ankle [Orthopedic]: Tel 908-276-6624, Address: 528 Boulevard, Kenilworth, NJ 07033
- Insurance- Mr. Shulim Waldman [Insurance]: Tel 732-569-4775
- Interior Deisgn- Moshe Reichman [Interior Design]: Tel 929-289-3994
- Interior Design- Space Planning- Chany Roth [Interior Design]: Tel 718-812-8159
- Intirestate Mobile Tire Repair [Car Maintance]: Tel 908-908-4737
- Isaac's Plumbing & Heating [Plumber]: Tel 347-589-5685/ 347-760-7533
- Ivy Therapy [Therapy]: Tel 908-276-0237, Address: 210 N Ave E, Cranford, NJ 07016
- Jell Tell [Phone Company]: Tel 212-444-1122
- Jenni's Nails [Waxing]: Tel 908-925-4422, Address: 885 N Stiles St
- Jersey Diagnostic Imaging [Imaging- X-Ray]: Tel 908-241-5222, Address: 929 N Wood Ave, Linden, NJ 07036
- Jersey Diagnostic Imaging [Radiologist]: Tel 908-241-5222, Address: 929 N Wood Ave, Linden, NJ 07036
- Jerusalem Pizza [Restaurant]: Tel 908-289-0291, Address: 150 Elmora Ave, Elizabeth, NJ
- JFK [Audiologist]: Tel 732-321-7063, Address: 65 James St, Edison, NJ 08818
- Joe [Landscapers]: Tel 908-499-2421
- Kalmy's Appliance Repair [Appliance Repair]: Tel 718-687-8333
- Kehilla [Butcher]: Tel 718-907-5151 Note: Daily Deliveries
- Kehillas [Butcher]: Tel 845-356-1110
- Kena Kitchen [Kitchen Installation]: Tel 201-753-1586, Address: 507W E St Georges Ave, Linden, NJ 07036
- Kena Kitchen [Tile Stores]: Tel 201-753-1586, Address: 507W E St Georges Ave, Linden, NJ 07036
- Kendall Plotzker [Babysitter]: Tel 908-305-5286
- Kessler Rehab [Therapy]: Tel 908-925-6797, Address: 350 W St Georges Ave, Linden, NJ 07036
- Kitchen Island [Kitchen Installation]: Tel 347-633-0756
- Klean Vents [Dryer Vent Cleaner]: Tel 929-317-1151
- Kol Linden [Advertising]: Tel 908-290-5591
- Kosher Direct [Cell Phone Store]: Tel 732-931-2444
- Kriah- Mrs. H. Knopfler [Tutoring]: Tel 347-675-2006
- Lab Corp [Hospitals/ Labs]: Tel 908-925-8406, Address: 1025 W St Georges Ave Ste 1, Linden, NJ 07036
- Lady Seamstress (comes down to house) [Alterations]: Tel 908-368-7827
- Landau's [Cleaners]: Tel 718-871-1240 Note: Pick up and deliveries twice a week Sun & Wed
- Lenape Pool [Pools]: Tel 917-843-6273
- Let's Go Movers [Movers]: Tel 718-480-0105
- Lico Life by Mrs. Secula [Health]: Tel 908-258-0499
- Lico Life Supplements [Health]: Tel 718-930-0967
- Life Line [OB/GYN]: Tel 973-379-7477, Address: 530 Morris Avenue #1, Springfield, NJ
- Linden Cab [Car Service]: Tel 908-862-6262
- Linden Car Leasing [Car Sales/ Leasing]: Tel 973-404-7044
- Linden Cooling [Heating / Cooling]: Tel 908-986-2421 Note: Installation & Servce
- Linden Food Basket [Grocery]: Tel 908-671-1887, Address: 911 W Saint Gorges Ave, Linden, NJ 07036
- Linden Hub [Office Space]: Tel 908-224-2626 Ext.102
- Linden Inbox [Advertising]: Tel 908-290-5591
- Linden Legacy [Hosiery Store]: Tel 845-262-8785, Address: 1305 Orchard Ter
- Linden Seforim Store [Judaica]: Tel 347-729-5073 / 347-946-5797
- Linden-tastic Tots [Prenursery]: Tel 917-589-7344
- Lisa [Pelvic Floor Therapist]: Tel 732-762-5188, Address: Comes to house
- Little Luxury [Baby Accessories]: Tel 718-797-2229
- Loadio [Music]: Tel 347-404-8680, Address: 304 Floral St
- Long Distance Mr. Reisz [Car Service]: Tel 347-971-6636
- Lonnie Morris CNM [OB/GYN]: Tel 201-567-0810, Address: 716 Broad St, Clifton, NJ 07013
- Lucy's Dry Cleaners [Alterations]: Tel 908-486-2424, Address: 438 N Wood Avenue
- Magic Smile [Dentist]: Tel 908-486-5000, Address: 515 N Wood Ave, Linden, NJ 07036 Note: **Private Insurance
- Make-up Artist- Bailee Reichman [Makeup Artists]: Tel 917-488-8860
- Make-up Artist- I. Mendelovitz [Makeup Artists]: Tel 347-262-3094
- Make-up Artist- Ruchele Katz [Makeup Artists]: Tel 347-930-8674
- Make-up Artist- Sarah'la Block [Makeup Artists]: Tel 929-229-9454
- Makeup Artist- Shaindy Gordon [Makeup Artists]: Tel 347-962-9292
- Makeup Artist- Tzippy Gross [Makeup Artists]: Tel 917-676-4343
- Malky [Babysitter]: Tel 929-454-2179
- Mancino Shoe Repair [Shoe Repair]: Tel 908-718-1848, Address: 109 N Wood Ave, Linden, NJ 07036
- Marcus [Pelvic Floor Therapist]: Tel 201-691-7293, Address: Passaic
- Marninah Hersch [Lactation Consultant]: Tel 516-507-4394, Address: 345 Plainfield Ave, Suite 201, Edison, NJ 08817
- Massage Therapist- Mrs. Rachel Fleisher BS, LMT, MP [Massage Therapist]: Tel 201-783-3414 Note: Pain, Women's Health, Anxiety, Athletes, Trauma...
- Me Time- Spa Services [Waxing]: Tel 718-704-8166
- Meadow Pharmacy [Pharmacies]: Tel 973-574-3040/ 973-500-8787 (Text orders), Address: 217 Brook Ave, Passic, NJ 07055
- Medrite [Urgent Care]: Tel 908-224-3333, Address: 580 Raritan Road, Roselle, NJ 07203
- Mega 53 [Grocery]: Tel 718-436-5353 Note: Wednesday delivery
- Mega Babies [Furniture]: Tel 718-437-3400 Note: Free Daily Deliveries
- Mehadrin Meats [Butcher]: Tel 718-686-9400 Note: Daily Deliveries fish and meat
- Meisels [Pools]: Tel 347-628-2179, Address: 10 W Gibbons
- Mendy's Photography [Photography]: Tel 773-715-5215 Note: For Simcha’s and family portraits
- Merzbach Provider- Raizy Aronowitz [Child Development Services]: Tel 845-548-0136
- Michal [Babysitter]: Tel 718-500-6397
- Michelle [Babysitter]: Tel 718-590-3013
- Milestones Pediatric Dentistry [Dentist]: Tel 908-245-7700, Address: 118 N Avenue West, Cranford
- Millburn Pediatrics [Pediatricians]: Tel 973-912-0155, Address: 159 Millburn Ave, Millburn, NJ 07041
- Miller's [Locksmith]: Tel 347-613-0546 Note: text only
- Mortgage Financing- Yossel Mandelbaum [Mortgage]: Tel 929-387-0814
- Motty's Construction [Construction]: Tel 908-666-6245
- MR Messenger [Messenger Service]: Tel 908-441-8331
- Mr. Benzion Gertner [Interior Design]: Tel 347-229-7030
- Mr. Chaim Engel [Mortgage]: Tel 347-969-2987
- Mr. Feuerwerker [Notarizer]: Tel 347-986-6863
- Mr. Hershy Schwartz [Electrician]: Tel 917-627-9918
- Mr. L. Miller [Real Estate Agent]: Tel 347-786-2011
- Mr. Moshe Yoel Gross [Mortgage]: Tel 347-844-1120
- Mr. Nachman Weber [Interior Design]: Tel 917-929-6369
- Mr. Nass [Mold Specialist]: Tel 917-662-6848
- Mr. Weingarten [Notarizer]: Tel 917-474-1998
- Mr. Wertzberger [Insurance]: Tel 718-246-2100
- Mr. Wigder [Real Estate Agent]: Tel 347-927-0016
- Mr. Y. Geller [Insurance]: Tel 908-248-2261 Note: Free assistance with union county medicaid
- Mr. Yanky Ehernfeld [Electrician]: Tel 347-930-7990
- Mr. Yanky Lebowitz [Handyman]: Tel 929-215-8534
- Mr. Yoel Adler [Graphic Designer]: Tel 718-637-0922
- Mr. Yossi Bornstein [Barber]: Tel 347-356-2681
- Mrs. Aviva Staddler [Babysitter]: Tel 718-744-4161
- Mrs. Baily Roth [Day Time]: Tel 347-645-4995
- Mrs. Baily Roth [Overnight]: Tel 347-645-4995
- Mrs. Baily Teitelbaum [Playgroup]: Tel 631-417-2080
- Mrs. C. B. Graus [Medical Referrals]: Tel 347-977-0258
- Mrs. C. Klein [Waxing]: Tel 347-790-5276
- Mrs. C. Sofer [Makeup Artists]: Tel 347-383-7435
- Mrs. C. Zimmer [Sarno Coach]: Tel 347-351-4299
- Mrs. Chavy Weiss [Hair]: Tel 917-670-6629 Note: Perms for boys
- Mrs. Ella Zenwirth [Day Time]: Tel 347-715-0592 Note: Afternoons
- Mrs. Esther Raizy Ackerman [Plastic Surgeon]: Tel 732-730-7333, Address: 539 Marc Dr, Lakewood, NJ Note: **Cash
- Mrs. Faigy Viznitzer [Overnight]: Tel 347-909-0732
- Mrs. Gerlitz [Custom Labels]: Tel 347-546-6729
- Mrs. Hirschfeld [Jewelry]: Tel 443-325-9791
- Mrs. L. Eidlisz [Exercise Instructor]: Tel 347-512-6154
- Mrs. Levi [Notarizer]: Tel 718-781-5683
- Mrs. M. Reinhold [Day Time]: Tel 347-675-1872
- Mrs. Miriam Barber [Day Time]: Tel 347-551-1378
- Mrs. Miriam Kraus [Playgroup]: Tel 347-585-8251 Note: 2x a week
- Mrs. P. Weinstock [Tutoring]: Tel 347-489-3738 Note: Kriah
- Mrs. R. Brandmark [Nits]: Tel 347-432-3316 / 718-871-5763
- Mrs. R. Kritzler [Day Time]: Tel 718-438-1385
- Mrs. R. Kritzler [Overnight]: Tel 718-438-1385
- Mrs. S. Elias [Nits]: Tel 718-807-7665
- Mrs. S. Kaufman [Nits]: Tel 347-452-5409
- Mrs. S. Kiwak [Tutoring]: Tel 347-446-7764 Note: Specializing in Kriah
- Mrs. S. Tauber [Tutoring]: Tel 917-960-1152
- Mrs. S. Wizel [Alterations]: Tel 347-534-6269
- Mrs. S. Y. Rottenberg [Simcha Yerushalmi Kugel]: Tel 347-447-8422
- Mrs. S. Zenwirth [Tutoring]: Tel 347-675-3273
- Mrs. Sara Y. Rottenberg [Drop ins]: Tel 347-447-8422
- Mrs. T. Hartman [Nits]: Tel 718-679-3709
- Mrs. Tzivi Rosenberg [Day Time]: Tel 347-385-7020
- Mrs. Winkler [Babysitter]: Tel 929-593-0386
- Mrs. Yenty Rosenbaum [Playgroup]: Tel 347-458-2343
- Mrs. Yenty Rosenbaum [Overnight]: Tel 347-458-2343
- Mrs. Zeida [Illustrator]: Tel 347-585-6695
- Music Lessons- Mr. Steinmetz [Music Lessons]: Tel 347-668-3438 Note: Music lessons for Men and Boys
- Music Lessons- Mrs. S. Kiwak [Music Lessons]: Tel 347-446-7764
- Musician- Eli Pfeiffer [Musician]: Tel 718-844-0038
- Musician- Mr. Chaim Shia Lowy [Musician]: Tel 347-645-3048
- Musician- Mr. Hersh David Posner [Musician]: Tel 347-768-0275
- Musician- Mr. Tzvi Dov Abromowitz [Musician]: Tel 347-404-8680
- My Sister's Closet [Clothing]: Tel 347-967-8177
- Natural Way [Breast Pump]: Tel 718-854-9406
- Naturally You Health Food Center [Health Food Store]: Tel 732-307-6929 Note: daily deliveries
- Neiman's Locksmith [Locksmith]: Tel 347-988-9162
- Nesher Marketing [Marketing]: Tel 718-637-0922
- Neurology [Neurology]: Tel 973-971-5700, Address: 11 Overlook Rd, Summit, NJ 07901
- Neurology Specialist of Monmouth County [Neurology]: Tel 732-935-1850, Address: 107 Monmouth Rd # 110, W Long Branch, NJ 07764
- New Eichler's [Judaica]: Tel 718-874-9771
- NJ Kids Pediatric Dental Group [Dentist]: Tel 908-888-6060, Address: 2201 Vauxhall Rd, Union, NJ 07083
- NJUCare [Urgent Care]: Tel 908-280-9600, Address: 141 Chestnut Street, Roselle Park, NJ 07204
- North Broad Pharmacy [Pharmacies]: Tel 908-533-9347, Address: 557 N Broad Street Elizabeth NJ 07208 Note: Fax- 908-533-9348
- Nu Vue Quality Cleaners [Cleaners]: Tel 908-241-1620, Address: 921 N Wood Avenue, Roselle, NJ
- Ocean Dermatology [Dermatologist]: Tel 732-876-3376, Address: 27 S Cooks Bridge Rd, Suite 2-14, Jackson Township, NJ 08527
- Organizer- Serenity Solutions [Organizer]: Tel 718-809-5963
- Organizing- Inch of Space [Organizer]: Tel 347-243-5986 / 718-438-4175
- Overlook Medical Center [Hospitals/ Labs]: Tel 908-522-2000, Address: 99 Beauvoir Ave, Summit, NJ 07901
- Palisades Eye Associates [Ophthalmology]: Tel 908-558-1717, Address: 727 Galloping Hill Road, Union, NJ 07083
- Pappardello [Restaurant]: Tel 908-487-6619, Address: 221 W St Georges Ave, Linden, NJ
- Parenting Coaching- ימין מקרבת [Parenting Coaching]: Tel 347-515-1739
- Parkway Foot and Ankle Center- Dr. William Freundlich [Podiatry]: Tel 973-591-0606, Address: 1010 Clifton Ave Suite 102, Clifton, NJ 07013
- Party Planning- Mrs. R. Gross [Party Planning]: Tel 718-576-9557
- Paskes & Company LLC [Accounting / CPA]: Tel 718-691-3066
- Perach Gabay [Babysitter]: Tel 908-418-2567
- Perfect Restoration and Cleaning [Restoration]: Tel 732-597-2398
- Perroquet of Linden [Shoe Store]: Tel 908-718-1623
- Personal Gym Trainer- Avrumi Danziger [Personal Trainer]: Tel 917-685-5913
- Personalized Gifts [Gifts]: Tel 201-693-5054
- Photog�nique Studio [Photography]: Tel 718-704-8166 Note: Portrait and Product Photography
- Photography- Hindy Braun [Photography]: Tel 917-521-9546 Note: Outdoor Photography
- Photography- Leah Goldberger [Photography]: Tel 917-982-8162
- Photography- Shevy's Photography [Photography]: Tel 646-325-8180
- Pinex Team [Graphic Designer]: Tel 718-840-3660
- Pinn Realty [Real Estate Agent]: Tel 908-585-4111
- Pinnacle Health [Health Food Store]: Tel 718-290-9300
- Pipeline Plumbing Service [Plumber]: Tel 732-526-5519
- Plaids & Pleats (Uniforms) [Clothing]: Tel 732-850-0204
- Plumber- Mr. M. Brandmark [Plumber]: Tel 347-603-2499
- Plumes Bedding [Bedding]: Tel 718-799-4777 Note: Pillows and Comforters Down and Alternitive Down
- PM Pediatrics [Urgent Care]: Tel 973-467-2767, Address: 355 US 22, Springfield, NJ 07081
- Pop Shoppe- preorder [Chocolate Arrangements]: Tel 646-832-8346
- Powerlutions Solar [Solar Panels]: Tel 888-SUN-4-ENERGY (786-4363)
- Premuim Builders [Construction]: Tel 201-344-4453
- Premuim Landscaping [Landscapers]: Tel 973-671-1820
- Prime Insurance [Insurance]: Tel 347-743-8072
- Prime Voltage [Low Voltage]: Tel 347-228-0499
- Print Out [Printing Company]: Tel 718-650-2020
- Pro Care Rehab [Physical Therapy]: Tel 732-340-1012, Address: 60 Walnut Ave, Linden, NJ 07036
- Pro Studio [Recording Studio]: Tel 347-907-1386
- Protouch [Physical Therapy]: Tel 908-325-6556, Address: 570 South Ave, E Bld G, Unit C, Cranford, NJ 07016
- Pulse Laser and Electrolysis [Electrolysis]: Tel 347-422-6642
- Pulse Laser and Electrolysis [Laser Hair Removal]: Tel 347-422-6642
- Quality Sewer & Drains [Sewer]: Tel 718-438-3334
- Queenery [Tichels]: Tel 908-801-6817, Address: 241 Audrey Ter
- Quest Diagnostics [Hospitals/ Labs]: Tel 908-245-1382, Address: 711 E 1st Ave Store 17, Roselle, NJ 07203
- Quick Lift [Garage]: Tel 732-998-1481
- Rachel's Corner [Clothing]: Tel 908-299-6466, Address: 514 W 7th Ave Roselle NJ
- Rahway Emergency Room [Hospitals/ Labs]: Tel 732-381-4200, Address: 865 Stone St, Rahway, NJ 07065
- Rectangle [Custom Closets]: Tel 929-813-2968
- Reflex Integration- Mrs H. Knopfler [Tutoring]: Tel 347-675-2006
- Reichman Construction [Construction]: Tel 917-202-6679
- Rena Appliance Repair [Appliance Repair]: Tel 845-362-0900
- Right Above Roofing, LLC [Roofing]: Tel 201-655-1117
- Rise Wellness [Health Food Store]: Tel 845-352-7473
- Rite Care [Urgent Care]: Tel 732-292-5665, Address: Comes to house
- Rock Leadership Solutions - Mr. Eli Katz [Bussiness Coach]: Tel 845-492-7911
- Rockstar Property Group [Real Estate Agent]: Tel 718-757-5860
- Root Canals Essex Endodontics [Endodontist]: Tel 973-783-3535, Address: 460 Bloomfield Ave Suite 311, Montclair, NJ 07042 Note: **takes Insurance
- Roselle Park Dental & Implants [Dentist]: Tel 908-620-5188, Address: 205 W Westfield Avenue, Roselle Park, NJ 07055
- Roselle Park Medical Associates [PCP]: Tel 908-241-0044, Address: 744 Galloping Hill Road, Suites A & B, Roselle Park, NJ 07204 Note: Adult PCP
- Roselle Shoe Repair [Shoe Repair]: Tel 908-241-1177, Address: 209 Chestnut St, Roselle, NJ 07203
- Rubino Group [OB/GYN]: Tel 973-736-1100, Address: 67 Walnut Ave. Suite 101, Clark, NJ 07066 Note: **Private Insurance
- Rutgers School of Dental Medicine [Endodontist]: Tel 973-972-4690, Address: 110 Bergen St, Newark, NJ 07103
- RWJ University HospitalNew Brunswick [Hospitals/ Labs]: Tel 732-828-3000, Address: 1 Robert Wood Johnson Pl, New Brunswick, NJ 08901
- Sabra [Sewer]: Tel 973-715-9422
- Saint Barnabas Medical Center [Hospitals/ Labs]: Tel 973-322-5000, Address: 94 Old Short Hills Rd, Livingston, NJ 07039
- Sanders [Hat Stores]: Tel 718-438-4829
- Sara Marks [Lactation Consultant]: Tel 917-592-1222, Address: From Staten Island Hospital- House Calls
- Sara Rivka Rice [Babysitter]: Tel 646-431-8876
- Satmar 13 [Butcher]: Tel 718-438-8444 Note: Daily Deliveries
- Satmar 51 [Butcher]: Tel 718-854-2100 Note: Daily Deliveries
- Satmar 53 [Butcher]: Tel 718-435-8200 Note: Daily Deliveries Mon.- Thursday orders need to be in by 12:00
- Scharf's Judaica [Judaica]: Tel 718-484-0340
- Sea Blue Fish [Fish stores]: Tel 908-379-9600, Address: 1025 W St Georges Ave, Linden, NJ 07036 Note: Local Delivery
- Sewer Works [Sewer]: Tel 718-218-3209
- Shades Decor [Window Shades]: Tel 646-242-4942
- Shaklee- Chany Roth [Health]: Tel 718-812-8159
- Shannon Babineau [Neurology]: Tel 908-522-0217, Address: 11 Overlook Rd Suite 230, Summit, NJ 07901
- Sheekey, David A DC [Chiropractor]: Tel 908-486-4900, Address: 1915 N Wood Ave, Linden, NJ 07036 Note: **Medicaid
- Sheila [Babysitter]: Tel 646-436-9147
- Sheina [Babysitter]: Tel 646-606-7149
- Shevy's Cosmetics Boutique [Makeup]: Tel 917-589-6593 Note: Full line skin care and cosmetics Mary Kay
- Shinu Child Nightwear [Clothing]: Tel 347-263-0888
- Shira [Babysitter]: Tel 908-370-8555
- Shiran Ovadia [Babysitter]: Tel 201-618-2291
- Shloss Meister- Mr. Hirsch [Locksmith]: Tel 646-730-6381
- Shore Children's Dental Care [Frenotomy (Tongue Tied)]: Tel 732-755-1492, Address: 28 Union Ave, Manasquan, NJ 08736 / 514 Garfield Ave, Avon-By-The-Sea, NJ 07717
- Shoshana Linfeild [Babysitter]: Tel 301-509-4748
- Shteimler [Shtreimel Service]: Tel 347-855-3355
- Silktrendz- Silk Scarves [Tichels]: Tel 347-304-0421
- Silver- Timeless Silver [Silver]: Tel 347-527-0608
- Simply Can [Garbage Can Cleaning Service]: Tel 866-927-4226
- Skincare and Cosmetics by Shaindy Gordon [Makeup]: Tel 347-962-9292 Note: Full line of skin care products
- Slingers [Shoes]: Tel 917-685-7467 Note: Call or text
- Smiling Molar [Dentist]: Tel 732-535-7102, Address: 2376 St Georges Ave, Linden, NJ Note: **Female Dentist
- Smilow Family Dentistry [Dentist]: Tel 973-379-2202, Address: 41 Mountain Avenue, Springfield Township, NJ 07081
- Snowsuits & Baby Coats [Clothing]: Tel 718-853-3238
- Sola [Credit Card Processing]: Tel 347-786-4386
- Song Writing- Magical Moments- R. B. Gerlitz [Song Writing]: Tel 718-972-5936
- Song Writing- Mrs. S. Katz [Song Writing]: Tel 347-924-3785
- Space Planning- Interior Design- Chany Roth [Interior Design]: Tel 718-812-8159
- Sparq Family Dental [Dentist]: Tel 732-355-6011, Address: 924 N Wood Ave
- Split Units Installation [Heating / Cooling]: Tel 917-748-7173
- Spot On Construction Management [Construction]: Tel 347-628-4835
- St Mary [Pharmacies]: Tel 908-925-7700, Address: 213 W St Georges Ave, Linden, NJ 07036 Note: We accept all NY insurance, we carry kosher vitamins
- St. Peter's Midwifery Program [OB/GYN]: Tel 732-339-7879
- Stekel CPA [Accounting / CPA]: Tel 347-564-3716
- Stone & Bath [Tile Stores]: Tel 718-438-4500
- Studio Recording By Mrs. L. Saks [Recording Studio]: Tel 929-247-9839
- Sunrise [OB/GYN]: Tel 732-972-4200, Address: 831 Tennent Road, Manalapan, NJ
- Surgical Step [Surgical Socks]: Tel 732-730-0525
- Surgical Step [Breast Pump]: Tel 732-730-0525
- Sweet Dreams Nursery [Furniture]: Tel 347-564-3487
- Sycamore Smile Pediatric Dentistry [Dentist]: Tel 732-963-8680, Address: 1029 Sycamore Ave Unit 1, Tinton Falls, NJ 07724
- TAG Office [Filters]: Tel 908-374-0050, Address: 923 N Wood Ave Linden Nj
- Tech Key [Kosher Kiosk]: Tel Women call: 718-887-1979 Men call: 347-893-5108, Address: 1302 Summit Ter
- Tender Smiles 4 Kids [Dentist]: Tel 908-245-5556, Address: 2209 N Wood Avenue, Linden, NJ 07036 Note: **Dr. Dan (Wednesdays) speaks Yiddish
- The Creative Shoppe [Personalized Gifts]: Tel 347-743-1715
- The Surgical Shop [Surgical Socks]: Tel 908-493-6950
- The W Real Estate Group [Real Estate Agent]: Tel 908-808-4881
- The W Real Estate Group- Avrum Duvid Weller [Real Estate Agent]: Tel 845-293-5537
- The W Real Estate Group- Benzion Weingarten [Real Estate Agent]: Tel 917-474-1998
- The W Real Estate Group- Joseph Weiss [Real Estate Agent]: Tel 845-729-1240
- Tots to Teens Dentistry [Dentist]: Tel 732-739-3535, Address: 2137 NJ-35 #240, Holmdel, NJ 07733
- Tots to Teens Dentistry [Orthodontist]: Tel 732-738-3535, Address: 702 N Beers St, Suite 3, Holmdel, NJ 07733
- Toy Station [Toys]: Tel 917-822-6189
- Tremp [Car Service]: Tel 732-479-7080
- Tri State Awnings [Awnings]: Tel 845-357-5718
- Trinitas Regional Medical Center [Hospitals/ Labs]: Tel 908-994-5000, Address: 225 Williamson St, Elizabeth, NJ 07202
- Trouserz (Boys' Clothing) [Clothing]: Tel 347-382-5145
- Truffles [Chocolate Arrangements]: Tel 347-628-2179, Address: 10 W Gibbons St
- Trugreen [Landscapers]: Tel 908-755-2795
- Tutoring- Mrs. E. Fogel [Tutoring]: Tel 718-887-1979
- Tuv Tam [Fish stores]: Tel 718-438-8704 Note: daily delivery
- Twinkle Layette [Clothing]: Tel 718-387-0530
- Union Classics [Hosiery Store]: Tel 718-758-8930
- Union County Division Of Social Services [Insurance]: Tel 908-965-2700, Address: 342 Westminster Ave, Elizabeth, NJ 07208
- Union County Orthopedic Group [Orthopedic]: Tel 908-402-1670, Address: 210 W St Georges Ave fl 2, Linden, NJ 07036 Note: **Dr. Richard P. Mackessy- hand/ Dr. Labev- pediatric
- Union Dental Group [Dentist]: Tel 908-688-1039, Address: 626 Chestnut St, Union, NJ 07083
- Union Pediatric Associates [Pediatricians]: Tel 908-688-8007, Address: 381 Chestnut St, Union, NJ 07083
- Union Pediatric Medical Group [Pediatricians]: Tel 908-688-9900, Address: 1050 Galloping Hill Rd. Suite 200, Union, NJ 07083
- University Childrens Eye Center Dr. Engel [Optometrist]: Tel 732-613-9191, Address: 4 Cornwall Ct, East Brunswick, NJ 08816
- University Radiology [Radiologist]: Tel 908-587-0035 Note: Few locations best to book on their website, universityradiology.com
- Unknown [OB/GYN]: Tel 973-285-0400 Morristown location
- Unknown [Bucherim Classes]: Tel 718-812-9893
- Vanguard Medical Group- Dr. Grossman [PCP]: Tel 908-272-7990, Address: 570 S Ave, E Bld G, Unit A, Cranford, NJ 07016 Note: Adult PCP
- Vikos Party Rental [Chair Rentals]: Tel 908-862-0188
- Vish Vash [Cleaning Company]: Tel 347-263-4005
- Voice Lessons- Mr. Horowitz [Voice Lessons]: Tel 347-782-3602
- Walgreens [Pharmacies]: Tel 908-925-0704, Address: 22 E St Georges Ave, Linden, NJ 07036
- Watchung Pediatrics [Pediatricians]: Tel 973-976-7337, Address: 225D Millburn Ave, Millburn, NJ 07041
- Web Design- Mrs. G Herz [Web Design]: Tel 845-527-5798
- Weiss Medical [Pulmonologist]: Tel 973-248-9199 / 201-523-9797, Address: 44 State Rt 23 North, Suite 6, Riverdale, NJ 07457 / 140 State Route 17 North, Suite 204, Paramus, NJ 07652
- Westfield Oral Surgery [Oral Surgeon]: Tel 908-233-8088, Address: 320 Lenox Avenue, Westfield, NJ 07090
- Westfield Pediatrics [Pediatricians]: Tel 908-232--3445, Address: 532 East Broad St, Westfield, NJ 07090
- While U Wait Dry Cleaners [Cleaners]: Tel 908-241-9609, Address: 483 E Westfield Avenue, Roselle Park, NJ
- Wig Repairs, Coloring, add Hair, and Highlights [Wig Repair]: Tel 929-549-4059
- Wigs by Blimie Friedlander [Wigs]: Tel 347-845-4140
- Wigs by Kaily Halpern [Wigs]: Tel 347-633-1107
- Wigs by Malky  Horowitz [Wigs]: Tel 929-214-0856
- Wigs by Mrs. Chavy Weiss [Wigs]: Tel 917-670-6629
- Wigs by Mrs. Gitty Rosenberg [Wigs]: Tel 347-374-0469
- Wigs by Tzivia [Wigs]: Tel 917-804-1461
- Wigs by Yitty Friedman [Wigs]: Tel 347-309-1219
- Williamsburg Pediatrics Dr. Zagelbaum [Pediatricians]: Tel 908-490-7700, Address: 930 N Wood Avenue, Linden, NJ
- Wiz Collision [Collision]: Tel 718-925-2949, Address: 703 Chester St, Brooklyn, NY 11236
- Women's Health Care Imaging [Radiologist]: Tel 908-964-0004, Address: 1896 Morris Ave, Union, NJ 07083
- Workspace Solutions [Office Space]: Tel 917-916-1497
- Writer- Yiddish- Mr. Yoel Adler [Writer]: Tel 718-637-0922
- Y & S Heating and Cooling [Heating / Cooling]: Tel 347-786-1085
- Yachad D'Bobov Medical Equipment [Medical Equipment]: Tel 347-675-6117
- Yael [Babysitter]: Tel 212-498-9808
- Yael [Babysitter]: Tel 845-300-6927
- Yehudis Itzkowitz [Babysitter]: Tel 908-436-9310
- Yid Tech [Cell Phone Store]: Tel 347-308-3291 Note: Free daily delivery (Local Business)
- Yonathan [Landscapers]: Tel 908-659-6549
- Zayco [Glasses Store]: Tel 917-937-6598, Address: 632 Minor Ter, Linden, NJ 07036
- מלא טעם [Party Planning]: Tel 917-803-6443
- Name [Community Category]: Tel Phone Number, Address: address (public_note)
- Mechitza Gemach [Gemachs]: Tel 914-606-2960
- Mrs. Sara Mindy Singer [Kallah Teacher]: Tel 718-781-2637
- TAG Office [ציבורי]: Tel 908-374-0050, Address: 923 N Wood Ave linden Nj
- Mikvah Tahara Satmar Linden [Mikvahs]: Tel 908-908-1550, Address: 30 Commerce Drive, Cranford, NJ 07016
- Lev Yachad [Organizations]: Tel 908-718-1550 x4
- Farina for Kimpeturins [Organizations]: Tel 347-292-7565
- Lindenlicious Shabbos Food [Organizations]: Tel 347-985-0948
- Chasunah Suitcase [Gemachs]: Tel 917-708-1409
- Tznius Hospital Gowns [Gemachs]: Tel 929-545-3000
- Firestone Complete Auto Care [Automotive]: Tel 908-290-0454, Address: 360 W St Georges Avenue
- Perth Amboy Wic [Social Services]: Tel 732-376-1188, Address: 313 State Street Second Floor Perth Amboy, NJ 08861
- Mikvah Tahara of Linden [Mikvahs]: Tel 862-240-8608, Address: 201 Dietz St, Cranford, NJ 07016
- Raimede Farm [Farms]: Tel 908-879-7762, Address: 122 Oakdale Road, Chester, NJ 07930
- sun High Orchards [Farms]: Tel 973-584-4734, Address: 19 Canfield Avenue, Randolph, NJ 07869
- New Jersey Botanical Gardens [Parks]: Tel 973-962-9534, Address: 5 Morris Road, Ringwood, NJ 07450
- Laurelwood Arboretum [Parks]: Tel 973-831-5675, Address: 725 Pines Lake Drive West, Wayne, NJ 07470
- Winter's Park [Parks], Address: 47 East Ramapo Avenue, Mahwah, NJ 07430
- Ringwood Manor State Park [Parks]: Tel 973-962-2240, Address: 1304 Sloatsburg Road, Ringwood, NJ 07456
- Regatta Playground [Parks], Address: 9 Cherry Lane West Orange, NJ 07052
- Saddle River County Park [Parks]: Tel 201-336-7275, Address: Wild Duck Pond 113E. Ridgewood Avenue, Ridgewood, NJ 07450
- Ramapo Vally Reservation [Parks]: Tel 201-327-3500, Address: 608 Ramapo Vally Road, Matwah, NJ 07430
- Overpeck County Park [Parks]: Tel 201-336-7275, Address: 50 Fort Lee Road, Leonia, NJ 07605
- Nomahegan Park [Parks], Address: 995 Springfield Avenue, Cranford, NJ 07016
- Mattano Park [Parks], Address: 360-484 5th Avenue, Elizabeth, NJ 07202
- Liberty State Park [Parks], Address: 535 Freedom Way, Jersey City, NJ 07305
- Grace Lord Park [Parks]: Tel 973-402-9410, Address: Plane St, Boonton, NJ 07005
- Finch Park [Parks], Address: 315 Island Road, Ramsey, NJ 07446
- Celery Farm Nature Preserve [Parks], Address: Franklin Turnpike, Allendale, NJ 07401
- Bear Mountain State Park [Parks], Address: 3006 Seven Lakes Drive, Bear Mountain, NY 10911
- Men's Malbishim [Gemachs]: Tel 347-452-3709
- Mekimi DVD Gemach [Gemachs]: Tel 347-832-5145 (For Hospital and Homebound Patients)
- Billirubin Light Gemach [Gemachs]: Tel 347-526-2073
- תפילה לדוד סטרי Roselle [Shuls], Address: 220 E 5th Ave, Roselle, NJ 07203
- ר' ארי לייב טייטלבוים - רב בית מדרש סלאטפינא [מדרך חתנים]: Tel 347-581-7794
- צאנז [תלמוד תורה]: Tel 718-475-1185
- בנות חיה [בית חינוך לבנות]: Tel 718-851-1212
- בעלז [Shuls], Address: 1600 N Stiles St, Linden, NJ 07036
- Trinitas Wic [Social Services]: Tel 908-994-5141, Address: 200 Willimson St, Suite 150, Medical Arts Building, Elizabeth, NJ  07202
- Union Mikvah Tehara מי בלומא [Mikvahs]: Tel 908-264-3272
- אלעסק [Shuls], Address: 13 W. Elm St, Linden, NJ 07036
- Mr. Moshe Teitelbaum [בדחן]: Tel 347-940-6886
- Burn and Wound Treatment Gemach Mrs. B. Kasten [Gemachs]: Tel 347-834-4580
- Kids Gown Gemach [Gemachs]: Tel 929-513-7394
- Woodbridge Mall [Malls]: Tel Woodbridge Center Dr, Woodbridge Township, NJ
- Menlo Park Mall [Malls]: Tel 55 Parsonage Rd, Edison, NJ 08837
- Legacy Square [Malls]: Tel 1000 W Edgar Rd, Linden, NJ 07036
- Linden Shopping Center [Malls]: Tel 691 W Edgar Rd, Linden, NJ 07036
- Jersey Gardens Mall [Malls]: Tel 651 Kapkowski Rd, Elizabeth, NJ 07201
- Clark Commons [Malls]: Tel 1255 Raritan Rd, Clark, NJ 07066
- American Dream [Malls]: Tel 1 American Dream Way, East Rutherford, NJ 07073
- Brook Haven [Malls]: Tel 217 Brook Ave, Passaic, NJ 07055
- The Event Space [Halls]: Tel 973-962-6962, Address: 217 Brook Ave, Passiac, NJ
- Linden Space [Halls]: Tel 908-718-2000 Ext 101, Address: 1201 Deerfield Ter., Linden, NJ 07036
- Anshi Chesed Hall [Halls]: Tel 908-486-8616, Address: 1000 Orchard Ter, Linden, NJ 07036
- World of Wing Butterfly Museum [Museums]: Tel 201-833-4650, Address: 1775 Windsor Rd, Teaneck, NJ (Distance: 40 Min)
- Paterson Museum [Museums]: Tel 973-321-1260, Address: 2 Market St, Paterson, NJ (Distance: 40 Min)
- Newark Airport [Museums]: Tel 973-961-6000, Address: 1 Brewster Rd, Newark, NJ (Distance: 20 Min)
- Liberty Science Center [Museums]: Tel 201-200-1000, Address: 222 Jersey City Blvd, Jersey City, NJ (Distance: 25-30 Min)
- Jersey Explorer Children's Museum [Museums]: Tel 973-673-6900, Address: 192 Dodd St, East Orange, NJ (Distance: 25-30 Min)
- Glasswork Studio [Museums]: Tel 973-656-0800, Address: 151 South St, Morristown, NJ (Distance: 35-40 Min)
- Aviation Hall & Museum of NJ [Museums]: Tel 201-288-6344, Address: 400 Fred Wehran Dr, Teterboro, NJ (Distance: 35 Min)
- SeaQuest Aquarium [Aquariums]: Tel 732-283-2945, Address: 101 Woodbridge Center Dr, Woodbridge Township, NJ (Distance: 20 Min)
- Ocean Gallery [Aquariums]: Tel 908-226-1100, Address: 980 US-22, North Plainfield, NJ (Distance: 25 Min)
- New Jersey SEA LIFE Aquarium [Aquariums]: Tel 551-234-6382, Address: 1 American Dream Way Suite A, East Rutherford, NJ (Distance: 30 Min)
- Whiteman's Farm [Farms]: Tel 201-833-4650, Address: 1111 Mt. Kemble Ave, Morristown, NJ (Distance: 35 Min)
- Turtle Back Zoo [Farms]: Tel 973-731-5800, Address: 560 Northfield Ave, W. Orange, NJ (Distance: 25 Min)
- Space Wild Animal Farm Inc. [Farms]: Tel 973-875-3223, Address: 218 County Road 519, Sussex, NJ (Distance: 1 Hr)
- Abma's Farm Market & Nursery [Farms]: Tel 201-891-0278, Address: 700 Lawlins Rd, Wyckoff, NJ (Distance: 40-45 Min)
- Oasis Family Farm [Farms]: Tel 609-259-7300, Address: 3 Circle Dr, Robbinsville, NJ (Distance: 45-50 Min)
- Lee Turkey Farm [Farms]: Tel 609-448-0629, Address: 201 Hickory Corner Rd, E Windsor, NJ (Distance: 45-50 Min)
- Historic Longstreet Farm (free) [Farms]: Tel 732-946-3758, Address: 44 Longstreet Rd, Holmdel, NJ (Distance: 30-35 Min)
- Doyles Farm [Farms]: Tel 908-824-2479, Address: 110 Summer Rd, Flemington, NJ (Distance: 45 Min)
- Doyles Unami Farms [Farms]: Tel 908-369-3184, Address: 771 Mill Ln, Hillsborough Township, NJ (Distance: 50 Min)
- Demarest Farms [Farms]: Tel 201-666-0472, Address: 244 Wierimus Rd, Hillsdale, NJ (Distance: 30-35 Min)
- Bergen County Zoo [Farms]: Tel 201-336-7261, Address: 216 Forest Ave, Paramus, NJ (Distance: 35 Min)
- Alstede Farms [Farms]: Tel 908-879-7189, Address: 1 Alstede Farms Ln, Chester, NJ (Distance: 50 Min)
- Urban Air Trampoline [Amusements]: Tel 732-640-8847, Address: 1600 St Georges Ave, Avenel, NJ (Distance: 10-15 Min)
- The Slime Factory Powered by Maddie Rae [Amusements]: Tel 301-818-7769, Address: 55 Parsonage Rd, Suite 2415, Edison, NJ (Distance: 20 Min)
- The Escape Room [Amusements]: Tel 201-514-5699, Address: 1 American Dream Way, Suite A, East Rutherford, NJ (Distance: 30 Min)
- Sky Zone Trampoline Park [Amusements]: Tel 973-671-5100, Address: 25 US-22, Springfield, NJ (Distance: 15 Min)
- Pump It Up [Amusements]: Tel 908-245-5867, Address: 158 E Westfield Ave, Roselle Pk, NJ (Distance: 45 Min)
- Oasis VRX Virtual Reality Entertainment Arcade [Amusements]: Tel 833-627-4787, Address: 101 Crawfords Corner Rd, Holmdel, NJ (Distance: 30 Min)
- Nickelodeon Universe Theme Park [Amusements]: Tel 833-263-7326, Address: 1 American Dream Way, East Rutherford, NJ (Distance: 30 Min)
- Mirror Maze [Amusements]: Tel 833-263-7326, Address: 1 American Dream Way, Suite A, East Rutherford, NJ (Distance: 30 Min)
- Linden Lanes [Amusements]: Tel 908-925-3550, Address: 741 N. Stiles St, Linden, NJ (Distance: 5 Min)
- Kidnetic [Amusements]: Tel 973-331-9001, Address: 2 Changebridge Rd, Montville, NJ (Distance: 40 Min)
- Kids Empire [Amusements]: Tel 908-257-0530, Address: 860 W Edgar Rd, Linden, NJ (Distance: 10 Min)
- Keansburg Amusement Park [Amusements]: Tel 732-495-1400, Address: 275 Beachway Ave, Keansburg, NJ (Distance: 35-40 Min)
- Imagine That [Amusements]: Tel 973-966-8000, Address: 4 Vreeland Rd, Florham Park, NJ (Distance: 30 Min)
- IPlay America [Amusements]: Tel 732-577-8200, Address: 100 Schanck Rd, Freehold, NJ (Distance: 45-50 Min)
- Funtime America [Amusements]: Tel 732-460-0700, Address: 269 Rt. 35, Eatontown, NJ (Distance: 40-45 Min)
- Funplex [Amusements]: Tel 973-428-1166, Address: 182 Rt. 10W, East Hanover, NJ (Distance: 30-35 Min)
- Chuck E. Cheese [Amusements]: Tel 908-688-0210, Address: 1660 US 22, Union, NJ (Distance: 10 Min)
- Build-A-Bear [Amusements]: Tel 732-744-1811, Address: 55 Parsonage Rd Space 1270B, Edison, NJ (Distance: 20 Min)
- Wilson Park Recreation Center [Parks]: Tel 908-298-3817, Address: Summit Terrace, Linden, NJ (Distance: 1 Min)
- Warinanco Park Paddle Boating [Parks]: Tel 908-298-7849, Address: One Park Dr, Roselle, NJ (Distance: 7 Min)
- Paddle Boating Echo Lake Park [Parks]: Tel 973-510-1997, Address: 1000 Park Dr, Mountainside, NJ (Distance: 15 Min)
- Campgaw Skiing & Tubing [Parks]: Tel 204-324-7800, Address: 200 Campgaw Rd, Mahwah, NJ (Distance: 50 Min)
- Great Falls Historic District Cultural [Parks], Address: 65 Mebridge Ave, Paterson, NJ (Distance: 30-35 Min)
- Intirestate Mobile Tire Repair [Automotive]: Tel 908-908-4737
- A-Tek Auto Care [Automotive]: Tel 908-718-5501, Address: 301 W. St Georges Ave, Linden, NJ
- Suspensions and Restoration Department [Automotive]: Tel 609-292-7500
- Wait Times Check at State Inspection Station [Automotive]: Tel 609-620-7992
- Inspection Services [Automotive]: Tel 609-633-9474
- General Information [Automotive]: Tel 609-292-6500
- NJ Motor Vehicle Commission [Automotive], Address: 1140 Woodbridge Rd & Hazelwood Ave, Rahway, NJ 07065
- Ziditchoiv Mikvah [Mikvahs]: Tel 862-240-8608, Address: 5 Raritan Rd, Linden, NJ
- Ziga Roshanski Mikvah- The Linden Mikvah [Mikvahs]: Tel 908-444-6518, Address: 1000 Orchard Ter, Linden, NJ
- Koson Mikvah [Mikvahs]: Tel 929-593-0386, Address: 2201 N Wood Ave, Roselle, NJ (Friday night, Yom tov)
- Bobov Mikvah [Mikvahs]: Tel 908-299-6111, Address: 316 Morningside Rd, Linden, NJ
- קופת צדקה [Organizations]: Tel 908-708-0472
- Lindenlicious Lunches Kimpeturin [Organizations]: Tel 718-781-5683
- Tznius Hospital Gowns [Gemachs]: Tel 917-554-2962
- Tables & Chairs [Gemachs]: Tel 917-599-1365
- Coat Rack Gemach [Gemachs]: Tel 917-676-4343
- Coat Gemach [Gemachs]: Tel 347-432-3316
- Bris Outfit Gemach [Gemachs]: Tel 347-693-8139
- Basic Tools Gemach incl. Shop Vac & Floor Fans [Gemachs]: Tel 917-599-1365
- Union Direct [ציבורי]: Tel 908-301-6377
- Linden Express [ציבורי]: Tel 908-486-2108
- Boro Park Mosdos Trans Tashbar [ציבורי]: Tel 908-287-9600
- להכשיר Kitchen Kashering [ציבורי]: Tel 347-578-5017
- כלים מקוה [ציבורי], Address: 1000 Orchard Terrace, Linden, NJ 07036 (open every day from 9-5 and during minyan times)
- כלים מקוה [ציבורי], Address: 330 Elmora Ave, Elizabeth, NJ 07208
- וועד העירוב [ציבורי]: Tel 908-777-1020
- הרב משה שלום שארר [סופר]: Tel 347-563-4351
- הרב אביגדור דניאל ווייס [סופר]: Tel 347-909-1048
- הרב מרדכי קריצלער [סופר]: Tel 646-707-5960
- הרב ישרא-ל אהרן קעסלער [סופר]: Tel 347-578-5017
- הרב חיים שלמה ראטטענבערג [סופר]: Tel 347-300-9523
- הרב משה בן ציון לאנדא [מוהלים]: Tel 347-526-2073
- הרב בן ציון ראטטענבערג [מוהלים]: Tel 347-397-7154
- מוסדות באבוב-45 [בית חינוך לבנות]: Tel 908-800-9700, Address: 1231 Burnet Ave, Union, NJ 07083
- מוסדות באבוב [בית חינוך לבנות]: Tel 908-718-2000, Address: 1201 Deerfeild Ter, Linden, NJ 07036
- מוסדות סאטמאר [בית חינוך לבנות]: Tel 908-645-1212, Address: 430 Market Street, Perth Amboy, NJ 08861
- מוסדות פאפא [תלמוד תורה]: Tel 908-991-7872, Address: 1281 Liberty Ave, Hillside, NJ 07205
- מוסדות באבוב-45 [תלמוד תורה]: Tel 908-800-9700, Address: 51 Park Ave, Piscataway, NJ 08854
- מוסדות באבוב [תלמוד תורה]: Tel 908-718-2000, Address: 1201 Deerfield Ter, Linden, NJ 07036
- מוסדות סאטמאר [תלמוד תורה]: Tel 908-645-1212, Address: 430 Market Street, Perth Amboy, NJ 08861
- תפילה לדוד סטרי Rahway [Shuls], Address: 262 Linden Ave, Rahway, NJ 07065
- ראחמסטריווקא [Shuls], Address: 135 Thelma Ter, Linden, NJ 07036
- ראחמסטריווקא [Shuls], Address: 129 Gesner St, Linden, NJ 07036
- קאלאמייא [Shuls], Address: 1725 N Stiles St, Linden, NJ 07036
- קהל אברכים ד'לינדען [Shuls], Address: 312 Birchwood Rd, Linden, NJ 07036
- קאסאן [Shuls], Address: 2201 N Wood Ter, Roselle, NJ 07203
- פאפא [Shuls], Address: 135 Harvard Rd, Linden, NJ 07036
- סלאטיפינא [Shuls], Address: 2715 N Wood Ave, Roselle, NJ 07203
- סאטמאר [Shuls], Address: 325 Elmwood Ter, Linden, NJ 07036
- זידיטשוב [Shuls], Address: 5 Raritan Rd, Linden, NJ 07036
- וויזניץ [Shuls], Address: 355 Douglas Rd, Roselle, NJ 07203
- באבוב-45 [Shuls], Address: 212 New Jersey Ave, Union, NJ 07083
- באבוב [Shuls], Address: 316 Morningside Rd, Linden, NJ 07036 היכל ניסן 2716 Dewitt Ter, Linden, NJ 07036 בית ניסן
- אנשי חסד [Shuls], Address: 1000 Orchard Ter, Linden, NJ 07036
- Verizon [Utilities]: Tel 800-837-4966
- Elizabethtown Gas [Utilities]: Tel 800-242-5830
- PSE&G [Utilities]: Tel 800-436-7734
- New Jersey American Water [Utilities]: Tel 800-272-1325
- NJ Comfort Health (Free Program) [Social Services]: Tel 800-934-3102 (Program is designed to help eligible households reduce energy costs)
- Medicaid Simplified [Social Services]: Tel 732-597-1214 (Text is preferable)
- Social Security Office [Social Services]: Tel 908- 965-2700, Address: 342 Westminster Ave, Elizabeth, NJ 07208
- NJ Food Stamps / EBT [Social Services]: Tel 800-997-3333
- NJ Family Care [Social Services]: Tel 800-701-0710
- NJ Medicaid Hotline [Social Services]: Tel 800-356-1561
- NJ Transit [Important Numbers]: Tel 973-275-5555
- ModivCare (medicaid paid transportation) [Social Services]: Tel 866-527-9933
- Post Office [Important Numbers]: Tel 800-275-8777, Address: 400 N Wood Ave, Suite A, Linden, NJ 07036
- Bulk Trash Pickup [Important Numbers]: Tel 908-474-8666
- DPW (Box drop-off) [Important Numbers]: Tel 908-474-8666, Address: 2 Donaldson Pl, Linden, NJ, 07036
- Police Department \ Non Emergency Linden [Important Numbers]: Tel 908-474-8500
- Chesed D'Linden [Organizations]: Tel 908-718-1550 (Rides to Hospitals, Kosher Food, and Medical Advice)
- חברים [Emergency Numbers]: Tel 908-777-1119
- הצלה [Emergency Numbers]: Tel 908-800-9200
- Police/ Fire [Emergency Numbers]: Tel 911

`;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.type === "text") {
        const userMessage = message.text.body;
        const userPhone = message.from;

        console.log(`Message from ${userPhone}: ${userMessage}`);

        const claudeResponse = await axios.post(
          "https://api.anthropic.com/v1/messages",
          {
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: DIRECTORY_DATA,
            messages: [{ role: "user", content: userMessage }],
          },
          {
            headers: {
              "x-api-key": CLAUDE_API_KEY,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json",
            },
          }
        );

        const reply = claudeResponse.data.content[0].text;
        console.log("Claude reply ready, sending to WhatsApp...");
        console.log("Using Phone Number ID:", PHONE_NUMBER_ID);
        console.log("Token preview:", WHATSAPP_TOKEN ? WHATSAPP_TOKEN.substring(0, 20) + "..." : "NOT SET");

        const waResponse = await axios.post(
          `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: userPhone,
            text: { body: reply },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("WhatsApp response status:", waResponse.status);
        console.log(`Replied to ${userPhone}`);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data));
    }
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Speedial bot is running on port ${PORT}`);
});
