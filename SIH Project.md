

## Problem Statement - 
• Background The Consumer Price Index (CPI) released by the National Statistical Office (NSO), Ministry of Statistics and Programme Implementation (MoSPI), is the primary measure of retail inflation in India and is used by the Reserve Bank of India (RBI) for setting monetary policy under the flexible inflation-targeting framework. The current CPI framework, however, collects 'Transport and Communication' sub-group prices, including air travel fares, primarily through manual price-collection from a limited set of outlets and ticketing offices. With over 90% of domestic air tickets in India now sold online through airline websites and Online Travel Aggregators (OTAs) such as MakeMyTrip, Yatra, EaseMyTrip, Cleartrip, Ixigo and Goibibo, manual collection no longer captures the highly dynamic, route-specific, and time-sensitive pricing that Indian consumers actually face. Airfares in India follow dynamic pricing where the same sector can vary by 200-400% within a single day depending on advance-booking window, day-of-week, demand surges, festival seasons and fuel-price-linked surcharges. ==There is therefore an urgent need for an automated, scalable and high-frequency data-collection system that mirrors what a real Indian traveller pays.==
• Detailed Description The problem statement envisages development of an end-to-end software platform that automatically web-scrapes airfare data from major Indian airline websites (IndiGo, Air India, Air India Express, Akasa Air, SpiceJet) and leading OTAs, ==cleans and normalises the collected price quotes, and computes a Real-time Airfare Price Index (APIx) at daily, weekly and monthly frequencies.== The system shall maintain a ==basket== of representative ==city-pairs== (such as DEL-BOM, DEL-BLR, BOM-BLR, DEL-CCU, BLR-HYD, MAA-DEL, etc.) selected on the basis of ==DGCA passenger-traffic data==, and shall capture fares for multiple advance-purchase windows (T+1, T+7, T+15, T+30, T+45 days). ==Scraping must handle JavaScript-rendered pages, dynamic CAPTCHAs, anti-bot measures, IP rotation, and session management while remaining compliant with the robots.txt and terms of service of source websites, with appropriate rate-limiting and ethical-scraping safeguards==. The collected raw quotes shall be passed through a data-cleaning pipeline that removes outliers, ==handles missing values==, accounts for ==cancellations/sold-out flights==, and ==separates base fare from taxes==, user-development fee and convenience charges. The dashboard must ==visualise price trends, sector-wise heatmaps, lead-time elasticity curves==, and ==provide an API that the NSO and RBI can consume==.

• Expected Solution: A working software prototype consisting of -

(a) a robust, ethically-designed multi-source web-scraping engine using Python (Scrapy/Selenium/Playwright) capable of scheduled daily extraction from airline portals; 

(b) a cleaned and de-duplicated airfare database with metadata such as origin, destination, carrier, advance-purchase window, fare-class, base fare, taxes and total fare; 

(c) an index-construction module based on PSD given routes and weights; 

(d) a web-based interactive dashboard showing the daily Airfare Price Index. The solution must include documentation, automated testing, and demonstrate at least 30 days of back-tested results against publicly available DGCA monthly average-fare data.

### Websites Needed To Scrape - 


| Source            | robots.txt | Fare-search path | robots status | ToS         | Decision |
| ----------------- | ---------- | ---------------- | ------------- | ----------- | -------- |
| IndiGo            | Available  | Need identify    | Not Allowed   | Not Allowed | Drop❌    |
| Air India         | Available  | Need identify    | Not Allowed   | Not Allowed | Drop❌    |
| Air India Express | Available  | Need identify    | Not Allowed   |             | Drop❌    |
| Akasa Air         | Available  | Need identify    | Allowed       | 90% Sure    | Go-Ahead |
| SpiceJet          | Available  | Need identify    | Allowed       | Allowed     | Go-Ahead |
| MakeMyTrip        | Available  | Need identify    | Not Allowed   | Allowed     | review   |
| Yatra             | Available  | Need identify    | Allowed       | 90% Sure    | Go-Ahead |
| EaseMyTrip        | Available  | Need identify    | Not Allowed   |             | Drop❌    |
| Cleartrip         | Available  | Need identify    | Not Allowed   |             | Drop❌    |
| Ixigo             | Available  | Need identify    | Allowed       | Not Allowed | Drop❌    |
| Goibibo           | Available  | Need identify    | Allowed       | 90% Sure    | review   |
## Requirements for the project - 

- [ ] Able to scrape the data as needed
- [ ] pass that scraped data to the database
- [ ] each in a basket of city pair(DEL-BOM, DEL-BLR, BOM-BLR) on the basis of DGCA passenger-traffic data
- [x] Check for the Robots.txt and terms and services
- [ ] Handle missing values
- [ ] Handle cancellations and sold out flights
- [ ] seperate base PRICE from taxes,user-development fee and convenience charges
- [ ] 
- [ ] EPL pipeline for data cleaning
- [ ] data model 
- [ ] it also needs to be fast
- [ ] Provide an API for them to fetch the results of the front end for the NSO and RBI 
- [ ] Requested MetaDATA - metadata such as origin, destination, carrier, advance-purchase window, fare-class, base fare, taxes and total fare

## Requirenments for the Front-end - 

- [ ] Able to Visualize prize trends
- [ ]  Show ==sector==-wise heatmaps
- [ ] Show Daily Airfare Price Index(Look into what it is ask Harsh S. for help if needed)
- [ ] Show an index-construction module based on Price Statistics Division(PDS) given routes and weights given by MoSPI.
- [ ] Show lead-time elasticity curves (WTF is this T_T)

Questions to Ask for HARSH's uncle - 
1. How to make the project as legally acceptable as possible
2. will the scrapper run only once a day of we need multiple times
3. 

### Scraping logic for Yatra.com - 
The city pairs are in a excel file named "flight_city_pairs_01.xlsx" with col name CITY1(for origin) to CITY2(for destnation) 
1. Make the code by filling the input starting point in "input.fs-16.bold.ng-touched.ng-dirty.ng-valid-parse.ng-invalid.ng-invalid-required.ellipsis.full-width.ng-pristine.ng-valid.ng-not-empty.ng-valid-required"(It'll give 2 input but the 1st one is for the arrival) then clicking enter.
2. then click in on the "input.fs-16.bold.ng-touched.ng-dirty.ng-invalid.ng-invalid-required.ellipsis.full-width.ng-pristine.ng-untouched.ng-valid.ng-not-empty.ng-valid-required" (it's 2nd one) for the destination and then click on the .
3. to search click on "button[ng-click="submitForm(modifySearch)"]"
4. Now select the date form the list of dates "ul.mob-calendar li.scroll-elem".
5. out of all the dates we will only scrape 1st 7 day we'll click on them one by one once each date is done.
6.  the data is inside "div.flightItem.border-shadow.pr.ow-figma", when the page loads there are 25 entries then we would need to scroll on the page and then wait for the new elements to load....it'll scroll till the page will not have the end of the page and there is no scroll 
















