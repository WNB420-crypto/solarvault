/* globals React, ReactDOM, Recharts, LucideReact, THREE */
const { useState, useEffect, useRef, useMemo } = React;
const {
  Sun, MapPin, Calculator, Box, UserPlus, FileSignature, ShoppingCart, ListChecks,
  ArrowLeft, Gauge, Sparkles, Zap, DollarSign, TrendingUp, Clock, Users, FileText,
  CheckCircle2, Circle, Save, RotateCcw, Mail, Phone, Send, Printer, Share2, Plus,
  Minus, Trash2, AlertTriangle, Package, X, Landmark, BatteryCharging, Info, Bot, Smartphone, ClipboardCheck, Scale, Medal, GraduationCap, Trophy, FileDown, QrCode, Camera, Gift, Percent, Car, Banknote, Shield, CloudLightning, Target, Globe, LogIn, LogOut, Eye, EyeOff, ChevronRight
} = LucideReact;
const {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell
} = Recharts;


/* ============== DATA ============== */
const STATE_RAW = [
['AL','Alabama','South',5.0,210,152,0.145,'partial',['Birmingham','Huntsville']],
['AK','Alaska','West',2.9,120,175,0.230,'none',['Anchorage','Fairbanks']],
['AZ','Arizona','West',6.6,300,148,0.135,'partial',['Phoenix','Tucson']],
['AR','Arkansas','South',5.0,205,130,0.115,'partial',['Little Rock','Fayetteville']],
['CA','California','West',5.8,270,175,0.310,'partial',['Los Angeles','San Diego']],
['CO','Colorado','West',5.7,245,115,0.140,'full',['Denver','Colorado Springs']],
['CT','Connecticut','Northeast',4.3,190,185,0.285,'full',['Hartford','Stamford']],
['DE','Delaware','Northeast',4.6,200,140,0.155,'full',['Wilmington','Dover']],
['FL','Florida','South',5.3,250,160,0.140,'full',['Miami','Orlando']],
['GA','Georgia','South',5.1,220,150,0.135,'partial',['Atlanta','Savannah']],
['HI','Hawaii','West',5.5,260,215,0.420,'none',['Honolulu','Hilo']],
['ID','Idaho','West',4.9,210,105,0.105,'partial',['Boise','Idaho Falls']],
['IL','Illinois','Midwest',4.6,200,135,0.155,'full',['Chicago','Springfield']],
['IN','Indiana','Midwest',4.4,190,140,0.140,'partial',['Indianapolis','Fort Wayne']],
['IA','Iowa','Midwest',4.7,205,125,0.135,'partial',['Des Moines','Cedar Rapids']],
['KS','Kansas','Midwest',5.3,225,130,0.135,'partial',['Wichita','Topeka']],
['KY','Kentucky','South',4.7,195,140,0.120,'partial',['Louisville','Lexington']],
['LA','Louisiana','South',5.0,215,150,0.115,'partial',['New Orleans','Baton Rouge']],
['ME','Maine','Northeast',4.1,185,145,0.225,'full',['Portland','Bangor']],
['MD','Maryland','Northeast',4.7,205,150,0.165,'full',['Baltimore','Annapolis']],
['MA','Massachusetts','Northeast',4.3,195,190,0.295,'full',['Boston','Worcester']],
['MI','Michigan','Midwest',4.2,180,145,0.180,'partial',['Detroit','Grand Rapids']],
['MN','Minnesota','Midwest',4.5,200,130,0.140,'full',['Minneapolis','Rochester']],
['MS','Mississippi','South',5.0,210,155,0.125,'none',['Jackson','Gulfport']],
['MO','Missouri','Midwest',4.9,210,135,0.115,'partial',['Kansas City','St. Louis']],
['MT','Montana','West',4.8,215,110,0.115,'partial',['Billings','Missoula']],
['NE','Nebraska','Midwest',5.2,220,120,0.115,'partial',['Omaha','Lincoln']],
['NV','Nevada','West',6.4,290,135,0.130,'partial',['Las Vegas','Reno']],
['NH','New Hampshire','Northeast',4.2,190,175,0.215,'full',['Manchester','Concord']],
['NJ','New Jersey','Northeast',4.5,195,160,0.175,'full',['Newark','Jersey City']],
['NM','New Mexico','West',6.4,295,120,0.140,'partial',['Albuquerque','Santa Fe']],
['NY','New York','Northeast',4.3,190,160,0.225,'full',['New York City','Buffalo']],
['NC','North Carolina','South',5.0,215,140,0.120,'full',['Charlotte','Raleigh']],
['ND','North Dakota','Midwest',4.7,210,115,0.110,'partial',['Fargo','Bismarck']],
['OH','Ohio','Midwest',4.3,185,140,0.150,'partial',['Columbus','Cleveland']],
['OK','Oklahoma','South',5.4,235,140,0.115,'none',['Oklahoma City','Tulsa']],
['OR','Oregon','West',4.2,180,115,0.120,'full',['Portland','Eugene']],
['PA','Pennsylvania','Northeast',4.4,190,150,0.160,'full',['Philadelphia','Pittsburgh']],
['RI','Rhode Island','Northeast',4.3,190,180,0.290,'full',['Providence','Warwick']],
['SC','South Carolina','South',5.1,220,150,0.140,'full',['Columbia','Charleston']],
['SD','South Dakota','Midwest',5.0,215,125,0.130,'none',['Sioux Falls','Rapid City']],
['TN','Tennessee','South',4.8,205,145,0.115,'none',['Nashville','Memphis']],
['TX','Texas','South',5.4,250,165,0.140,'none',['Houston','Austin']],
['UT','Utah','West',5.8,260,105,0.110,'partial',['Salt Lake City','Provo']],
['VT','Vermont','Northeast',4.1,180,150,0.205,'full',['Burlington','Montpelier']],
['VA','Virginia','South',4.8,205,140,0.135,'partial',['Virginia Beach','Richmond']],
['WA','Washington','West',3.8,160,115,0.105,'full',['Seattle','Spokane']],
['WV','West Virginia','South',4.4,180,135,0.125,'partial',['Charleston','Huntington']],
['WI','Wisconsin','Midwest',4.3,190,130,0.155,'full',['Milwaukee','Madison']],
['WY','Wyoming','West',5.4,235,115,0.115,'partial',['Cheyenne','Casper']],
];

function strHash(str){ let h=0; for(let i=0;i<str.length;i++){ h=(Math.imul(31,h)+str.charCodeAt(i))|0; } return h; }
function variance(seed, range){ const v=Math.sin(seed)*10000; const frac=v-Math.floor(v); return (frac*2-1)*range; }

function buildStates(){
  return STATE_RAW.map(([abbr,name,region,sunHours,consistentDays,bill,rate,nm,cityNames])=>{
    const cities = cityNames.map(cityName=>{
      const seed = strHash(abbr+cityName);
      return {
        name: cityName,
        sunHours: +(sunHours+variance(seed,0.3)).toFixed(2),
        consistentDays: Math.round(consistentDays+variance(seed+1,15)),
        bill: Math.round(bill+variance(seed+2,15)),
        rate, netMetering: nm,
      };
    });
    return { abbr, name, region, sunHours, consistentDays, bill, rate, netMetering: nm, cities };
  });
}
const STATES = buildStates();

function scoreOf(d){
  const sunScore = Math.min(1, d.sunHours/6.5)*40;
  const consistencyScore = Math.min(1, d.consistentDays/300)*25;
  const billScore = Math.min(1, d.bill/220)*20;
  const rateScore = Math.min(1, d.rate/0.35)*15;
  return Math.round(sunScore+consistencyScore+billScore+rateScore);
}
function ratingLabel(score){ return score>=80?'Exceptional':score>=65?'Strong':score>=50?'Good':'Fair'; }
function ratingColor(score){ return score>=80?'#fbbf24':score>=65?'#f59e0b':score>=50?'#d97706':'#78716c'; }
const NM_LABEL = { full:'Full retail net metering', partial:'Partial / reduced export rate', none:'No standard net metering' };

function estimateSolar(d, opts={}){
  const touFactor = opts.touFactor ?? 1;
  const monthlyUsageKwh = d.bill / d.rate;
  const deratedDaily = d.sunHours * 0.78;
  const baseKw = monthlyUsageKwh / (deratedDaily*30);
  const systemKw = +(baseKw*1.15).toFixed(2);
  const monthlyProd = systemKw*deratedDaily*30;
  const surplus = Math.max(0, monthlyProd-monthlyUsageKwh);
  const exportFactor = d.netMetering==='full'?1:d.netMetering==='partial'?0.5:0.2;
  const buyback = surplus*d.rate*exportFactor*touFactor;
  const offset = Math.min(monthlyUsageKwh, monthlyProd)*d.rate*touFactor;
  const totalMonthly = offset+buyback;
  const gross = systemKw*1000*3.1;
  const itc = gross*0.30;
  const net = gross-itc;
  const paybackYears = totalMonthly>0 ? net/(totalMonthly*12) : 99;
  return { monthlyUsageKwh, systemKw, monthlyProd, surplus, buyback, offset, totalMonthly, gross, itc, net, paybackYears, touFactor };
}
/* ---- panel degradation: ~0.5%/yr is a typical modern manufacturer curve ---- */
const DEGRADE_RATE = 0.005;
function degFactor(yearsElapsed){ return Math.pow(1-DEGRADE_RATE, yearsElapsed); }

function buildProjection(calc, srec, escalationRate=0){
  const data=[]; let cum=-calc.net;
  data.push({ year:0, value: Math.round(cum), flat: Math.round(cum) });
  for(let y=1;y<=25;y++){
    const d = degFactor(y-1);
    const esc = Math.pow(1+(escalationRate/100), y);
    const srecAdd = srec && y<=srec.years ? srec.monthly*12*d : 0;
    cum += calc.totalMonthly*12*d*esc + srecAdd;
    data.push({ year:y, value: Math.round(cum) });
  }
  return data;
}
function buildProjectionFlat(calc, srec){
  // flat (no escalation) baseline for comparison overlay
  const data=[]; let cum=-calc.net;
  data.push({ year:0, flat: Math.round(cum) });
  for(let y=1;y<=25;y++){
    const d = degFactor(y-1);
    const srecAdd = srec && y<=srec.years ? srec.monthly*12*d : 0;
    cum += calc.totalMonthly*12*d + srecAdd;
    data.push({ year:y, flat: Math.round(cum) });
  }
  return data;
}
const fmtUSD = n => `$${Math.round(n).toLocaleString()}`;
const fmtNum = (n,d=1) => Number(n).toFixed(d);

/* ---- environmental impact constants (EPA eGRID 2023 US avg) ---- */
const CO2_PER_KWH_KG = 0.386;          // kg CO2 per kWh
const CO2_PER_TREE_KG_YR = 21.77;      // kg CO2 absorbed per tree per year
const CO2_PER_CAR_KG_YR = 4600;        // kg CO2 per avg car per year
const CO2_PER_HOME_KG_YR = 7500;       // kg CO2 per avg US home per year
function calcEnvImpact(calc){
  const annualKwh = calc.monthlyProd * 12;
  const annualCo2Kg = annualKwh * CO2_PER_KWH_KG;
  const treesEq = annualCo2Kg / CO2_PER_TREE_KG_YR;
  const carsEq = annualCo2Kg / CO2_PER_CAR_KG_YR;
  const homesEq = annualCo2Kg / CO2_PER_HOME_KG_YR;
  const lifetime25Co2Tons = (annualCo2Kg * 25 * 0.89) / 1000; // ~11% avg degradation over 25yr
  return { annualKwh, annualCo2Kg, treesEq, carsEq, homesEq, lifetime25Co2Tons };
}

/* ---- time-of-use rate exposure (illustrative) ---- */
const TOU_STATES = { CA:0.82, AZ:0.88, NV:0.85, CO:0.92 };
function getTouFactor(abbr, hasBattery){
  const base = TOU_STATES[abbr];
  if(base==null) return 1;
  return hasBattery ? Math.min(1, base+0.15) : base;
}

/* ---- SREC / incentive-stacking markets (illustrative) ---- */
const SREC_DATA = {
  NJ: { price:120, years:15, program:'NJ TREC' },
  MA: { price:60, years:10, program:'MA SMART' },
  IL: { price:75, years:15, program:'Illinois Shines ABP' },
  OH: { price:8, years:15, program:'Ohio SREC market' },
  PA: { price:25, years:15, program:'PA SREC market' },
  MD: { price:60, years:15, program:'Maryland SREC market' },
  DE: { price:30, years:15, program:'Delaware SREC market' },
};
function getSrec(abbr, monthlyProdKwh){
  const d = SREC_DATA[abbr];
  if(!d) return null;
  return { ...d, monthly: (monthlyProdKwh/1000)*d.price };
}

/* ---- financing math ---- */
function calcLoanPayment(principal, apr, years){
  const r = apr/12, n = years*12;
  if(r===0) return principal/n;
  return principal*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
}
function buildFinancingOptions(calc, rate, srec){
  const loanTerm = 15, loanApr = 0.069;
  const loanPayment = calcLoanPayment(calc.net, loanApr, loanTerm);
  const leasePayment = calc.offset*0.78;
  const ppaRate = rate*0.78;
  const ppaPayment = calc.monthlyProd*ppaRate;
  const srecMonthly = srec ? srec.monthly : 0;
  return [
    { id:'cash', label:'Cash purchase', upfront:calc.net, monthlyPayment:0, monthlyGrossBenefit:calc.totalMonthly, monthlyNet:calc.totalMonthly, owns:true, itc:true, srecMonthly, color:'#fbbf24' },
    { id:'loan', label:`Solar loan (${loanTerm}yr @ ${(loanApr*100).toFixed(1)}%)`, upfront:0, monthlyPayment:loanPayment, monthlyGrossBenefit:calc.totalMonthly, monthlyNet:calc.totalMonthly-loanPayment, owns:true, itc:true, termYears:loanTerm, srecMonthly, color:'#34d399' },
    { id:'lease', label:'Solar lease', upfront:0, monthlyPayment:leasePayment, monthlyGrossBenefit:calc.offset, monthlyNet:calc.offset-leasePayment, owns:false, itc:false, srecMonthly:0, color:'#60a5fa' },
    { id:'ppa', label:'PPA (pay-per-kWh)', upfront:0, monthlyPayment:ppaPayment, monthlyGrossBenefit:calc.offset, monthlyNet:calc.offset-ppaPayment, owns:false, itc:false, paymentDegrades:true, srecMonthly:0, color:'#f472b6' },
  ];
}
function buildFinancingProjection(opt, calc, srec){
  const data=[]; let cum=-(opt.upfront||0);
  for(let y=0;y<=20;y++){
    data.push({ year:y, value: Math.round(cum) });
    const d = degFactor(y);
    const gross = opt.monthlyGrossBenefit*d;
    const inTerm = opt.termYears!=null ? y<opt.termYears : true;
    const payment = !inTerm ? 0 : (opt.paymentDegrades ? opt.monthlyPayment*d : opt.monthlyPayment);
    const srecAdd = (opt.srecMonthly>0 && srec && y<srec.years) ? opt.srecMonthly*d : 0;
    cum += (gross-payment+srecAdd)*12;
  }
  return data;
}
const OUTAGE_HOURS = { LA:18, MS:14, TX:12, FL:10, WV:14, OK:10, AR:11, AL:10, SC:9, NC:8, CA:9, NY:7, NJ:7, CT:7, MI:8, OH:7 };
function getOutageHours(abbr){ return OUTAGE_HOURS[abbr] ?? 6; }

/* ---- permitting & HOA (illustrative) ---- */
const PERMIT_WEEKS = { CA:8, NY:7, NJ:6, MA:6, CT:6, MD:5, IL:5, FL:3, TX:3, AZ:3, NV:4, GA:4, NC:4, SC:4, OH:5 };
function getPermitWeeks(abbr){ return PERMIT_WEEKS[abbr] ?? 4; }
const PERMIT_STEPS = ['Plan set submitted','Permit application filed','Permit approved','Rough inspection passed','Final inspection passed','Utility interconnection (PTO) filed','PTO granted'];

/* ---- state & utility rebate database (illustrative, as of 2024) ---- */
// type: per_watt | per_kwh_battery | flat | pct_cost | tax_credit_pct
const REBATE_DB = {
  NY:[
    { name:'NY-Sun', level:'state', type:'per_watt', value:0.20, cap:5000, source:'NYSERDA', note:'Declining block incentive — current block may differ' },
  ],
  MA:[
    { name:'MassCEC Solar Rebate', level:'state', type:'per_watt', value:0.05, cap:1000, source:'Mass Clean Energy Center' },
    { name:'Mass Save Heat Pump+Solar', level:'utility', type:'flat', value:625, cap:625, source:'National Grid / Eversource', note:'Requires qualifying heat pump in same project' },
  ],
  CA:[
    { name:'SGIP Battery Storage Rebate', level:'utility', type:'per_kwh_battery', value:200, cap:2700, source:'CPUC SGIP', note:'Battery storage only — solar-only installs not eligible' },
    { name:'TECH Clean CA Heat Pump', level:'state', type:'flat', value:3000, cap:3000, source:'CPUC', note:'Requires qualified heat pump — check current availability' },
  ],
  CT:[
    { name:'RSIP Residential Incentive', level:'state', type:'per_watt', value:0.463, cap:7500, source:'CT DEEP / Eversource / UI' },
  ],
  MD:[
    { name:'CleanEnergy Rebate', level:'state', type:'flat', value:1000, cap:1000, source:'MD Energy Administration' },
    { name:'MD Solar Tax Credit', level:'state', type:'tax_credit_pct', value:30, cap:5000, source:'MD Dept of Assessments', note:'30% state credit stacks on top of 30% federal ITC' },
  ],
  CO:[
    { name:'Xcel Solar*Rewards', level:'utility', type:'flat', value:500, cap:500, source:'Xcel Energy', note:'Xcel service territory only' },
  ],
  TX:[
    { name:'Austin Energy Solar Rebate', level:'utility', type:'flat', value:2500, cap:2500, source:'Austin Energy', note:'Austin service territory only — most TX utilities offer nothing' },
  ],
  OR:[
    { name:'OR Solar + Storage Rebate', level:'state', type:'per_watt', value:0.25, cap:5000, source:'Oregon DOE / Energy Trust' },
  ],
  SC:[
    { name:'SC Solar Energy Tax Credit', level:'state', type:'pct_cost', value:25, cap:3500, source:'SC DOR' },
  ],
  NM:[
    { name:'NM Solar Market Dev Tax Credit', level:'state', type:'pct_cost', value:10, cap:9000, source:'NM TRD' },
  ],
  IL:[
    { name:'Illinois Shines ABP', level:'state', type:'per_watt', value:0.10, cap:4000, source:'IL DCEO / Elevate Energy', note:'Stacks on top of SREC income' },
  ],
  FL:[
    { name:'FL Sales Tax Exemption', level:'state', type:'pct_cost', value:6, cap:99999, source:'FL DOR', note:'Sales tax exemption on solar equipment — applied at point of sale' },
  ],
  NJ:[
    { name:'NJ Sales Tax Exemption', level:'state', type:'pct_cost', value:6.625, cap:99999, source:'NJ DOR', note:'Stacks with NJ TREC SREC program' },
  ],
  AZ:[
    { name:'AZ Residential Solar Tax Credit', level:'state', type:'tax_credit_pct', value:25, cap:1000, source:'AZ DOR' },
  ],
};
function getRebates(abbr){ return REBATE_DB[abbr] || []; }
function calcRebateValue(rebate, systemKw, batteryKwh=0, grossCost=0){
  if(rebate.type==='per_watt') return Math.min(rebate.cap, systemKw*1000*rebate.value);
  if(rebate.type==='per_kwh_battery') return Math.min(rebate.cap, batteryKwh*rebate.value);
  if(rebate.type==='flat') return rebate.value;
  if(rebate.type==='pct_cost'||rebate.type==='tax_credit_pct') return Math.min(rebate.cap, grossCost*(rebate.value/100));
  return 0;
}
function calcRebateStack(abbr, systemKw, grossCost, batteryKwh=0){
  const itc = grossCost*0.30;
  const rebates = getRebates(abbr).map(r=>({ ...r, amount: calcRebateValue(r, systemKw, batteryKwh, grossCost) }));
  const totalRebates = rebates.reduce((s,r)=>s+r.amount, 0);
  const netCost = Math.max(0, grossCost - itc - totalRebates);
  return { grossCost, itc, rebates, totalRebates, netCost };
}



/* ---- EV charging data ---- */
const EV_MODELS = [
  { id:'model3', name:'Tesla Model 3', kwhPerMile:0.25 },
  { id:'modely', name:'Tesla Model Y', kwhPerMile:0.28 },
  { id:'models', name:'Tesla Model S', kwhPerMile:0.30 },
  { id:'modelx', name:'Tesla Model X', kwhPerMile:0.33 },
  { id:'bolt', name:'Chevy Bolt EV', kwhPerMile:0.28 },
  { id:'leaf', name:'Nissan Leaf', kwhPerMile:0.30 },
  { id:'f150l', name:'Ford F-150 Lightning', kwhPerMile:0.45 },
  { id:'rivian', name:'Rivian R1T / R1S', kwhPerMile:0.47 },
  { id:'ioniq5', name:'Hyundai Ioniq 5', kwhPerMile:0.30 },
  { id:'ev6', name:'Kia EV6', kwhPerMile:0.28 },
  { id:'id4', name:'VW ID.4', kwhPerMile:0.30 },
  { id:'other', name:'Other EV', kwhPerMile:0.31 },
];

/* ---- solar lender marketplace (illustrative) ---- */
const LENDERS = [
  { id:'mosaic', name:'Mosaic', minScore:640, approval:'Same day',
    website:'joinmosaic.com', note:'Leading residential solar lender. Strong platform across most states.',
    products:[
      { name:'EcoPlus 25', term:25, apr:5.99, dealerFee:30, popular:true },
      { name:'EcoPlus 20', term:20, apr:4.99, dealerFee:27 },
      { name:'EcoHome 12', term:12, apr:2.99, dealerFee:25, note:'ITC paydown in year 1 recommended' },
    ]},
  { id:'greensky', name:'GreenSky', minScore:640, approval:'24-48 hrs',
    website:'greensky.com', note:'Flexible products including zero-dealer-fee options. Strong in home improvement channel.',
    products:[
      { name:'Plan 1621', term:15, apr:9.99, dealerFee:0, note:'No dealer fee — APR reflects true lender cost' },
      { name:'Plan 1422', term:12, apr:5.99, dealerFee:18 },
    ]},
  { id:'sunlight', name:'Sunlight Financial', minScore:650, approval:'Same day',
    website:'sunlightfinancial.com', note:'Strong in CA, FL, TX. Good contractor tech platform and fast decisions.',
    products:[
      { name:'PL-25', term:25, apr:6.99, dealerFee:29 },
      { name:'PL-20', term:20, apr:4.99, dealerFee:27, popular:true },
      { name:'PL-12', term:12, apr:3.99, dealerFee:24 },
    ]},
  { id:'sfc', name:'Service Finance Co.', minScore:620, approval:'Same day',
    website:'servicefinance.com', note:'Lower minimum score. Popular with contractors in Southeast and Midwest.',
    products:[
      { name:'Solar 25', term:25, apr:7.49, dealerFee:28 },
      { name:'Solar 15', term:15, apr:5.49, dealerFee:24 },
    ]},
];

/* ---- HOA solar rights by state (illustrative — verify before citing) ---- */
const HOA_SOLAR_RIGHTS = {
  AZ:{ level:'full', statute:'A.R.S. § 33-1816', summary:'HOA rules prohibiting or unreasonably restricting solar installations are void and unenforceable.' },
  CA:{ level:'full', statute:'Civil Code § 714', summary:'Among the strongest protections nationally. Restrictions on solar are void. HOA may only impose reasonable location and aesthetic conditions.' },
  CO:{ level:'full', statute:'C.R.S. § 38-30-168', summary:'HOA cannot prohibit solar energy devices on residential property.' },
  FL:{ level:'full', statute:'F.S. § 163.04', summary:'HOA cannot prohibit solar collectors or solar energy devices on rooftops.' },
  TX:{ level:'full', statute:'Tex. Prop. Code § 202.010', summary:'Deed restrictions prohibiting solar panels are void. One of the broadest preemption statutes.' },
  NV:{ level:'full', statute:'NRS § 111.239', summary:'Any covenant prohibiting solar energy systems is void against public policy.' },
  NM:{ level:'full', statute:'N.M.S.A. § 47-3-4', summary:'Solar rights protected; restrictive covenants against solar are void.' },
  OR:{ level:'full', statute:'ORS § 105.880', summary:'Prohibitions on solar energy systems are unenforceable.' },
  MD:{ level:'full', statute:'Md. Code, Real Prop. § 2-119', summary:'Restrictions on solar energy collectors are void and unenforceable.' },
  UT:{ level:'full', statute:'Utah Code § 57-13-1', summary:'Covenants restricting solar panels are void. Strong preemption language.' },
  VA:{ level:'full', statute:'Va. Code § 67-700', summary:'HOA cannot prohibit solar panels or solar energy collection devices.' },
  WA:{ level:'full', statute:'RCW § 64.38.055', summary:'HOA may regulate but cannot prohibit solar panels on single-family homes.' },
  GA:{ level:'full', statute:'O.C.G.A. § 44-9-20', summary:'Restrictions on solar energy use are void and against public policy.' },
  SC:{ level:'full', statute:'S.C. Code § 27-1-60', summary:'Deed restrictions prohibiting solar panels are void.' },
  IL:{ level:'full', statute:'765 ILCS 165/1', summary:'Solar energy systems protected; HOA restrictions on installation are limited by statute.' },
  OH:{ level:'full', statute:'O.R.C. § 5301.70', summary:'Restrictions prohibiting solar energy systems are void.' },
  PA:{ level:'full', statute:'73 P.S. § 1648.3', summary:'Solar energy restrictions and prohibitions are unenforceable.' },
  MN:{ level:'full', statute:'Minn. Stat. § 500.30', summary:'Solar energy easements protected; restrictive covenants are limited.' },
  HI:{ level:'full', statute:'Haw. Rev. Stat. § 196-7', summary:'Solar energy devices cannot be prohibited by HOA or deed restriction.' },
  LA:{ level:'full', statute:'La. R.S. § 9:1244', summary:'Prohibitions on solar energy systems are not enforceable.' },
  DE:{ level:'full', statute:'25 Del. C. § 316', summary:'HOA restrictions on solar energy systems are void.' },
  RI:{ level:'full', statute:'R.I. Gen. Laws § 34-40-1', summary:'Solar access rights protected; restrictions unenforceable.' },
  ME:{ level:'full', statute:'33 M.R.S. § 1302', summary:'Solar energy rights recognized and protected from restrictive covenants.' },
  WI:{ level:'full', statute:'Wis. Stat. § 66.0401', summary:'Local and HOA restrictions on solar energy systems are prohibited.' },
  IN:{ level:'full', statute:'Ind. Code § 32-26-13', summary:'Deed restrictions on solar energy systems are void.' },
  OK:{ level:'full', statute:'60 O.S. § 851', summary:'Solar rights recognized and protected from HOA prohibition.' },
  MO:{ level:'full', statute:'Mo. Rev. Stat. § 442.012', summary:'Restrictions on solar energy systems in deeds or HOA rules are void.' },
  SD:{ level:'full', statute:'S.D.C.L. § 43-31-18', summary:'Solar energy restrictions in CC&Rs are unenforceable.' },
  VT:{ level:'full', statute:'27 V.S.A. § 547', summary:'Solar access rights protected; prohibitions void.' },
  NC:{ level:'partial', statute:'N.C.G.S. § 22B-20', summary:'HOA may set reasonable restrictions on placement and aesthetics but cannot prohibit solar outright.' },
  NJ:{ level:'partial', statute:'N.J.S.A. § 45:22A-48.2', summary:'HOA can regulate aesthetics but cannot prohibit solar. Applies to planned communities.' },
  NY:{ level:'partial', statute:'Real Property Law § 235-e', summary:'Limited protections. HOA retains meaningful authority to restrict.' },
  MA:{ level:'partial', statute:'M.G.L. c. 184, § 23C', summary:'Restrictions must be reasonable — outright prohibition is not permitted but significant restrictions are allowed.' },
  CT:{ level:'partial', statute:'Conn. Gen. Stat. § 47a-3j', summary:'Solar rights recognized; HOA retains regulatory authority over siting and aesthetics.' },
  MI:{ level:'partial', statute:'MCL § 559.158', summary:'Partial protections for condos. Single-family HOA authority varies by governing documents.' },
  TN:{ level:'partial', statute:'T.C.A. § 66-35-101', summary:'Limited protections. HOA may restrict placement, size, and aesthetics.' },
  NH:{ level:'partial', statute:'RSA § 477:50', summary:'Solar easements recognized. HOA authority not fully preempted.' },
  ID:{ level:'partial', statute:'Idaho Code § 55-2701', summary:'Solar access rights recognized with latitude remaining for HOA reasonable restrictions.' },
  MT:{ level:'partial', statute:'Mont. Code § 70-17-401', summary:'Solar access easements allowed. HOA authority is not eliminated.' },
  KY:{ level:'none', statute:null, summary:'No state preemption law. HOA retains full authority over solar under governing documents.' },
  AL:{ level:'none', statute:null, summary:'No state law protecting solar from HOA restrictions.' },
  AR:{ level:'none', statute:null, summary:'No solar access preemption statute in place.' },
  AK:{ level:'none', statute:null, summary:'No state preemption. HOA can prohibit solar installations.' },
  WV:{ level:'none', statute:null, summary:'No solar access law. HOA authority is not limited by statute.' },
  MS:{ level:'none', statute:null, summary:'No state preemption law.' },
  KS:{ level:'none', statute:null, summary:'No statutory solar access rights against HOA authority.' },
  NE:{ level:'none', statute:null, summary:'No state solar preemption statute.' },
  IA:{ level:'none', statute:null, summary:'No preemption — HOA has full authority under its documents.' },
  ND:{ level:'none', statute:null, summary:'No solar access preemption law.' },
  WY:{ level:'none', statute:null, summary:'No state law limiting HOA authority on solar.' },
};
const HOA_LEVEL_COLOR = { full:'#34d399', partial:'#fbbf24', none:'#71717a' };
const HOA_LEVEL_LABEL = { full:'Full preemption', partial:'Partial protection', none:'No state law' };

const CATALOG = [
  { id:'p1', cat:'Panel', name:'REC Alpha Pure-R 430W', spec:'430W mono, 22.3% eff.', price:289, distributor:'CED Greentech' },
  { id:'p2', cat:'Panel', name:'Qcells Q.Tron 425W', spec:'425W mono, 22.0% eff.', price:255, distributor:'Soligent' },
  { id:'i1', cat:'Inverter', name:'Enphase IQ8+ Microinverter', spec:'290VA, per-panel MPPT', price:175, distributor:'CED Greentech' },
  { id:'i2', cat:'Inverter', name:'SolarEdge SE7600H-US', spec:'7.6kW string inverter', price:1450, distributor:'Soligent' },
  { id:'b1', cat:'Battery', name:'Tesla Powerwall 3', spec:'13.5kWh, integrated inverter', price:9500, distributor:'Krannich Solar' },
  { id:'b2', cat:'Battery', name:'Enphase IQ Battery 5P', spec:'5kWh modular storage', price:4200, distributor:'CED Greentech' },
  { id:'m1', cat:'Mounting', name:'IronRidge XR100 Rail Kit', spec:'10-panel composition shingle kit', price:620, distributor:'Soligent' },
  { id:'mo1', cat:'Monitoring', name:'Enphase Envoy Gateway', spec:'System monitoring + comms', price:340, distributor:'CED Greentech' },
];

/* ============== UI ATOMS ============== */
function SunArc({ hour=12.5, size=120 }){
  const w=size, h=size/2+12, cx=w/2, cy=h-10, r=w/2-10;
  const t=Math.max(0,Math.min(1,(hour-6)/12));
  const angle=Math.PI*(1-t);
  const x=cx-r*Math.cos(angle), y=cy-r*Math.sin(angle);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#3f3f46" strokeWidth="2" strokeDasharray="3 5"/>
      <line x1={cx-r} y1={cy} x2={cx+r} y2={cy} stroke="#27272a" strokeWidth="2"/>
      <circle cx={x} cy={y} r="6" fill="#fbbf24"/>
      <circle cx={x} cy={y} r="11" fill="#fbbf24" opacity="0.25"/>
    </svg>
  );
}
function Card({ children, className='' }){ return <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 ${className}`}>{children}</div>; }
function Eyebrow({ children }){ return <div className="text-[11px] uppercase tracking-widest text-amber-500/80 font-semibold mb-2">{children}</div>; }
function StatBlock({ label, value, sub, icon:Icon }){
  return (
    <div className="flex items-start gap-3">
      {Icon && <div className="mt-1 p-2 rounded-lg bg-amber-500/10 text-amber-400"><Icon size={16}/></div>}
      <div>
        <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
        <div className="text-xl font-mono font-semibold text-zinc-50">{value}</div>
        {sub && <div className="text-xs text-zinc-500">{sub}</div>}
      </div>
    </div>
  );
}
function ScoreBadge({ score }){
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold" style={{ backgroundColor: ratingColor(score)+'22', color: ratingColor(score), border:`1px solid ${ratingColor(score)}55` }}>{score}</div>
      <span className="text-xs text-zinc-400">{ratingLabel(score)}</span>
    </div>
  );
}
function Btn({ children, onClick, variant='primary', icon:Icon, className='', disabled }){
  const base="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed";
  const styles={ primary:"bg-amber-500 text-zinc-950 hover:bg-amber-400", ghost:"bg-zinc-800 text-zinc-200 hover:bg-zinc-700", outline:"border border-zinc-700 text-zinc-300 hover:border-amber-500/60 hover:text-amber-400" };
  return <button disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{Icon && <Icon size={15}/>}{children}</button>;
}
function Field({ label, children }){ return <label className="block"><div className="text-xs text-zinc-500 mb-1">{label}</div>{children}</label>; }
const inputCls = "w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60 placeholder:text-zinc-600";
function Toast({ message }){
  if(!message) return null;
  return <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-zinc-800 border border-amber-500/30 text-zinc-100 text-sm px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-400"/> {message}</div>;
}

/* ============== DASHBOARD ============== */
function DashboardView({ prospects, setView }){
  const stageCounts = useMemo(()=>{ const c={}; prospects.forEach(p=>{c[p.stage]=(c[p.stage]||0)+1;}); return c; },[prospects]);
  const topStates = useMemo(()=>[...STATES].sort((a,b)=>scoreOf(b)-scoreOf(a)).slice(0,8),[]);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Eyebrow>SolarVault · Agent Console</Eyebrow>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight">Solar sales, start to finish.</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-md">Rate any address, model the roof, build the proposal, close the deal, order the gear — one console.</p>
          <div className="flex gap-2 mt-4">
            <Btn icon={UserPlus} onClick={()=>setView('onboarding')}>New Prospect</Btn>
            <Btn variant="outline" icon={MapPin} onClick={()=>setView('ratings')}>Browse Ratings</Btn>
          </div>
        </div>
        <SunArc size={150} hour={13}/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><StatBlock icon={Users} label="Prospects" value={prospects.length}/></Card>
        <Card><StatBlock icon={FileSignature} label="Contracts Signed" value={prospects.filter(p=>p.documents?.some(d=>d.type==='Service Agreement'&&d.status==='executed')).length}/></Card>
        <Card><StatBlock icon={Package} label="Equipment Orders" value={prospects.reduce((s,p)=>s+(p.equipmentOrders?.length||0),0)}/></Card>
        <Card><StatBlock icon={Zap} label="Active Installs" value={prospects.filter(p=>p.stage==='Installed'||p.stage==='Active (PTO)').length}/></Card>
      </div>
      <Card>
        <Eyebrow>Top performing states right now</Eyebrow>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topStates.map(s=>({ name:s.abbr, score:scoreOf(s) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
            <XAxis dataKey="name" stroke="#71717a" fontSize={12}/>
            <YAxis stroke="#71717a" fontSize={12} domain={[0,100]}/>
            <Tooltip contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
            <Bar dataKey="score" radius={[6,6,0,0]}>{topStates.map((s,i)=><Cell key={i} fill={ratingColor(scoreOf(s))}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <Eyebrow>Pipeline snapshot</Eyebrow>
        {prospects.length===0 ? <p className="text-sm text-zinc-500">No prospects yet. Start onboarding to populate your pipeline.</p> : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(stageCounts).map(([stage,count])=>(
              <div key={stage} className="bg-zinc-800 px-3 py-1.5 rounded-full text-xs text-zinc-300 flex items-center gap-2">{stage} <span className="font-mono text-amber-400">{count}</span></div>
            ))}
          </div>
        )}
      </Card>
      <p className="text-[11px] text-zinc-600 leading-relaxed">Estimates across SolarVault are illustrative — modeled from regional solar-resource and rate data with simplified derate factors and net-metering tiers. Production use should pull live NREL PVWatts/NSRDB data and verified utility tariffs before quoting.</p>
    </div>
  );
}

/* ============== RATINGS (state -> city) ============== */
function RatingsView({ loc, setLoc }){
  if(!loc.stateAbbr){
    const list = [...STATES].sort((a,b)=>scoreOf(b)-scoreOf(a));
    return (
      <div className="space-y-4">
        <Eyebrow>All 50 states, ranked by solar economics</Eyebrow>
        <Card>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={list.map(s=>({ name:s.abbr, score:scoreOf(s) }))} layout="vertical" margin={{ left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false}/>
              <XAxis type="number" domain={[0,100]} stroke="#71717a" fontSize={11}/>
              <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={10} width={32}/>
              <Tooltip contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
              <Bar dataKey="score" radius={[0,6,6,0]}>{list.map((s,i)=><Cell key={i} fill={ratingColor(scoreOf(s))}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {list.map(s=>(
            <button key={s.abbr} onClick={()=>setLoc({ stateAbbr:s.abbr, cityIdx:null })} className="text-left">
              <Card className="hover:border-amber-500/50 transition h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-zinc-100">{s.name}</div>
                  <ScoreBadge score={scoreOf(s)}/>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                  <div>☀ {fmtNum(s.sunHours)} hrs/day</div>
                  <div>{s.consistentDays} clear days/yr</div>
                  <div>{fmtUSD(s.bill)}/mo avg bill</div>
                  <div>{s.netMetering} NM</div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }
  const state = STATES.find(s=>s.abbr===loc.stateAbbr);
  return (
    <div className="space-y-4">
      <button onClick={()=>setLoc({ stateAbbr:null, cityIdx:null })} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All states</button>
      <Eyebrow>{state.name} — cities</Eyebrow>
      <Card>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={state.cities.map(c=>({ name:c.name, score:scoreOf(c) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
            <XAxis dataKey="name" stroke="#71717a" fontSize={11}/>
            <YAxis stroke="#71717a" fontSize={11} domain={[0,100]}/>
            <Tooltip contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
            <Bar dataKey="score" radius={[6,6,0,0]}>{state.cities.map((c,i)=><Cell key={i} fill={ratingColor(scoreOf(c))}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {state.cities.map((c,i)=>(
          <Card key={c.name}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-zinc-100">{c.name}</div>
              <ScoreBadge score={scoreOf(c)}/>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
              <div>☀ {fmtNum(c.sunHours)} hrs/day</div>
              <div>{c.consistentDays} clear days/yr</div>
              <div>{fmtUSD(c.bill)}/mo avg bill</div>
              <div>{NM_LABEL[c.netMetering]}</div>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600">Neighborhood-level scoring is the natural next layer once parcel-level shading and rooftop data are wired in — this view rolls up at the city level for now.</p>
    </div>
  );
}

/* ============== CALCULATOR ============== */
function CalculatorView({ loc, setLoc, setView, setProspectPrefill }){
  const selState = STATES.find(s=>s.abbr===loc.stateAbbr) || STATES.find(s=>s.abbr==='CA');
  const selCity = selState.cities[loc.cityIdx ?? 0];
  const [hasBattery, setHasBattery] = useState(false);
  const [escalation, setEscalation] = useState(3.5);
  const touFactor = useMemo(()=>getTouFactor(selState.abbr, hasBattery),[selState.abbr, hasBattery]);
  const isTouState = TOU_STATES[selState.abbr]!=null;
  const calc = useMemo(()=>estimateSolar(selCity, { touFactor }),[selCity, touFactor]);
  const srec = useMemo(()=>getSrec(selState.abbr, calc.monthlyProd),[selState.abbr, calc.monthlyProd]);
  const projection = useMemo(()=>buildProjection(calc, srec, escalation),[calc, srec, escalation]);
  const projectionFlat = useMemo(()=>buildProjectionFlat(calc, srec),[calc, srec]);
  const chartData = useMemo(()=>projection.map((p,i)=>({ year:p.year, withEsc:p.value, flat: projectionFlat[i]?.flat ?? p.value })),[projection, projectionFlat]);
  const env = useMemo(()=>calcEnvImpact(calc),[calc]);
  return (
    <div className="space-y-5">
      <Eyebrow>Savings & buyback calculator</Eyebrow>
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Field label="State">
            <select className={inputCls} value={selState.abbr} onChange={e=>setLoc({ stateAbbr:e.target.value, cityIdx:0 })}>
              {STATES.map(s=><option key={s.abbr} value={s.abbr}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="City">
            <select className={inputCls} value={loc.cityIdx ?? 0} onChange={e=>setLoc({ ...loc, stateAbbr:selState.abbr, cityIdx:Number(e.target.value) })}>
              {selState.cities.map((c,i)=><option key={c.name} value={i}>{c.name}</option>)}
            </select>
          </Field>
        </div>
      </Card>
      {isTouState && (
        <Card className="border-amber-500/30">
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-400 mt-0.5 flex-shrink-0"/>
            <div className="text-xs text-zinc-400">
              <span className="text-zinc-200 font-medium">{selState.name} bills on time-of-use rates.</span> Solar produces midday when power is cheapest, but the bill is driven by evening peak rates — so flat-rate offset math overstates value here unless production is shifted to peak hours with a battery. Currently capturing <span className="font-mono text-amber-400">{Math.round(touFactor*100)}%</span> of full-rate value.
            </div>
          </div>
          <label className="flex items-center gap-2 mt-3 text-xs text-zinc-300 cursor-pointer">
            <input type="checkbox" checked={hasBattery} onChange={e=>setHasBattery(e.target.checked)} className="accent-amber-500"/>
            Include battery storage (shifts production to peak hours)
          </label>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Eyebrow>Sun profile — {selCity.name}</Eyebrow>
          <div className="flex items-center gap-4 mb-3">
            <SunArc hour={6+selCity.sunHours} size={130}/>
            <div className="space-y-2">
              <div className="font-mono text-2xl text-amber-400">{fmtNum(selCity.sunHours)} <span className="text-sm text-zinc-500">peak sun hrs/day</span></div>
              <div className="font-mono text-lg text-zinc-200">{selCity.consistentDays} <span className="text-sm text-zinc-500">consistent clear days/yr</span></div>
            </div>
          </div>
          <ScoreBadge score={scoreOf(selCity)}/>
        </Card>
        <Card>
          <Eyebrow>Bill & buyback policy</Eyebrow>
          <StatBlock icon={DollarSign} label="Average monthly bill" value={fmtUSD(selCity.bill)} sub={`${selCity.rate.toFixed(3)}/kWh utility rate`}/>
          <div className="h-px bg-zinc-800 my-3"/>
          <StatBlock icon={AlertTriangle} label="Net metering policy" value={selCity.netMetering.toUpperCase()} sub={NM_LABEL[selCity.netMetering]}/>
        </Card>
      </div>
      <Card>
        <Eyebrow>Recommended system & monthly economics</Eyebrow>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBlock icon={Zap} label="System size" value={`${fmtNum(calc.systemKw,2)} kW`}/>
          <StatBlock icon={TrendingUp} label="Bill offset / mo" value={fmtUSD(calc.offset)}/>
          <StatBlock icon={Sun} label="Buyback / mo" value={fmtUSD(calc.buyback)} sub="surplus sold to utility"/>
          <StatBlock icon={DollarSign} label="Total monthly benefit" value={fmtUSD(calc.totalMonthly + (srec?srec.monthly:0))}/>
        </div>
        <div className="h-px bg-zinc-800 my-4"/>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatBlock icon={DollarSign} label="System cost (after 30% ITC)" value={fmtUSD(calc.net)} sub={`gross ${fmtUSD(calc.gross)}`}/>
          <StatBlock icon={Clock} label="Estimated payback" value={`${fmtNum(calc.paybackYears)} yrs`}/>
          <StatBlock icon={TrendingUp} label="25-yr net (with escalation)" value={fmtUSD(projection[25].value)}/>
        </div>
      </Card>
      {srec && (
        <Card className="border-amber-500/30">
          <Eyebrow>SREC / incentive-stacking income — {selState.name}</Eyebrow>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBlock icon={Landmark} label="Program" value={srec.program}/>
            <StatBlock icon={DollarSign} label="Certificate price" value={`${fmtUSD(srec.price)}/MWh`} sub={srec.price<20?'Volatile/low — set expectations carefully':'Stacks on top of bill offset'}/>
            <StatBlock icon={TrendingUp} label="Extra income / mo" value={fmtUSD(srec.monthly)} sub={`for ~${srec.years} years, based on production`}/>
          </div>
          <p className="text-[11px] text-zinc-600 mt-3">SRECs/equivalent credits are a separate revenue stream from net-metering buyback, paid for total production rather than usage offset. Prices are market-driven and swing with supply — this figure is illustrative, not a quote.</p>
        </Card>
      )}
      <Card>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <Eyebrow>25-year savings trajectory{srec?` (incl. SREC)`:''}</Eyebrow>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Utility rate escalation:</span>
            <input type="range" min={0} max={6} step={0.5} value={escalation} onChange={e=>setEscalation(Number(e.target.value))} className="w-28 accent-amber-500"/>
            <span className="font-mono text-amber-400 w-8">{escalation}%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
            <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickFormatter={y=>`Yr ${y}`}/>
            <YAxis stroke="#71717a" fontSize={11} tickFormatter={v=>`$${Math.round(v/1000)}k`}/>
            <Tooltip formatter={(v,n)=>[fmtUSD(v), n==='withEsc'?`With ${escalation}%/yr escalation`:'Flat rates']} labelFormatter={y=>`Year ${y}`} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
            <Line type="monotone" dataKey="withEsc" stroke="#fbbf24" strokeWidth={2.5} dot={false} name="withEsc"/>
            {escalation>0 && <Line type="monotone" dataKey="flat" stroke="#52525b" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="flat"/>}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-zinc-600 mt-2">Gold line applies {escalation}%/yr utility rate escalation (US avg ~3–4%/yr historically) + 0.5%/yr panel degradation. Dashed grey is flat-rate baseline. The gap widens each year — that's the case for locking in today's rate.</p>
      </Card>

      <Card>
        <Eyebrow>Environmental impact — {selCity.name}</Eyebrow>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-zinc-800 rounded-xl">
            <div className="text-2xl mb-1">🌿</div>
            <div className="font-mono text-lg text-emerald-400">{fmtNum(env.annualCo2Kg/1000, 1)} <span className="text-xs text-zinc-400">t CO₂</span></div>
            <div className="text-[11px] text-zinc-500">offset annually</div>
          </div>
          <div className="text-center p-3 bg-zinc-800 rounded-xl">
            <div className="text-2xl mb-1">🌳</div>
            <div className="font-mono text-lg text-emerald-400">{Math.round(env.treesEq)} <span className="text-xs text-zinc-400">trees</span></div>
            <div className="text-[11px] text-zinc-500">equivalent per year</div>
          </div>
          <div className="text-center p-3 bg-zinc-800 rounded-xl">
            <div className="text-2xl mb-1">🚗</div>
            <div className="font-mono text-lg text-emerald-400">{fmtNum(env.carsEq, 1)} <span className="text-xs text-zinc-400">cars</span></div>
            <div className="text-[11px] text-zinc-500">off the road per year</div>
          </div>
          <div className="text-center p-3 bg-zinc-800 rounded-xl">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-mono text-lg text-amber-400">{fmtNum(env.lifetime25Co2Tons, 0)} <span className="text-xs text-zinc-400">t CO₂</span></div>
            <div className="text-[11px] text-zinc-500">lifetime offset (25yr)</div>
          </div>
        </div>
        <p className="text-[11px] text-zinc-600 mt-3">Based on EPA eGRID 2023 US average grid emission factor (0.386 kg CO₂/kWh). Regional grids vary — a coal-heavy grid makes solar's environmental case even stronger; a renewables-heavy grid reduces it.</p>
      </Card>

      <Btn icon={UserPlus} onClick={()=>{ setProspectPrefill({ state:selState.name, city:selCity.name, billMonthly:selCity.bill }); setView('onboarding'); }}>Start prospect from this location</Btn>
    </div>
  );
}

/* ============== FINANCING & STORM/BATTERY ============== */
function FinancingView({ loc, setLoc }){
  const selState = STATES.find(s=>s.abbr===loc.stateAbbr) || STATES.find(s=>s.abbr==='CA');
  const selCity = selState.cities[loc.cityIdx ?? 0];
  const [batteryIncluded, setBatteryIncluded] = useState(false);
  const isTouState = TOU_STATES[selState.abbr]!=null;
  const touFactor = useMemo(()=>getTouFactor(selState.abbr, batteryIncluded),[selState.abbr, batteryIncluded]);
  const calc = useMemo(()=>estimateSolar(selCity, { touFactor }),[selCity, touFactor]);
  const srec = useMemo(()=>getSrec(selState.abbr, calc.monthlyProd),[selState.abbr, calc.monthlyProd]);
  const options = useMemo(()=>buildFinancingOptions(calc, selCity.rate, srec),[calc, selCity.rate, srec]);
  const [activeOpt, setActiveOpt] = useState('loan');
  const projections = useMemo(()=>options.map(o=>({ opt:o, data: buildFinancingProjection(o, calc, srec) })),[options, calc, srec]);
  const chartData = useMemo(()=>{
    const years = projections[0].data.map(d=>d.year);
    return years.map(y=>{
      const row = { year:y };
      projections.forEach(p=>{ row[p.opt.id] = p.data.find(d=>d.year===y).value; });
      return row;
    });
  },[projections]);

  const [essentialLoad, setEssentialLoad] = useState(1.5);
  const [batteryKwh, setBatteryKwh] = useState(13.5);
  const [batteryCost, setBatteryCost] = useState(9500);
  const [valuePerHour, setValuePerHour] = useState(18);
  const outageHours = getOutageHours(selState.abbr);
  const backupHours = batteryKwh/essentialLoad;
  const coveredHours = Math.min(backupHours, outageHours);
  const annualValue = coveredHours*valuePerHour;
  const batteryPaybackYears = annualValue>0 ? batteryCost/annualValue : Infinity;

  return (
    <div className="space-y-5">
      <Eyebrow>Financing comparator</Eyebrow>
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Field label="State">
            <select className={inputCls} value={selState.abbr} onChange={e=>setLoc({ stateAbbr:e.target.value, cityIdx:0 })}>
              {STATES.map(s=><option key={s.abbr} value={s.abbr}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="City">
            <select className={inputCls} value={loc.cityIdx ?? 0} onChange={e=>setLoc({ ...loc, stateAbbr:selState.abbr, cityIdx:Number(e.target.value) })}>
              {selState.cities.map((c,i)=><option key={c.name} value={i}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        {isTouState && (
          <label className="flex items-center gap-2 mt-3 text-xs text-zinc-300 cursor-pointer">
            <input type="checkbox" checked={batteryIncluded} onChange={e=>setBatteryIncluded(e.target.checked)} className="accent-amber-500"/>
            {selState.name} bills on time-of-use rates — include battery storage (shifts production to peak hours, recovers most of the lost value)
          </label>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map(o=>(
          <button key={o.id} onClick={()=>setActiveOpt(o.id)} className="text-left">
            <Card className={`h-full transition ${activeOpt===o.id?'border-amber-500/60':'hover:border-zinc-700'}`}>
              <div className="text-xs font-semibold mb-2" style={{ color:o.color }}>{o.label}</div>
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between"><span>Upfront</span><span className="font-mono text-zinc-200">{fmtUSD(o.upfront)}</span></div>
                <div className="flex justify-between"><span>{o.id==='ppa'?'Avg payment/mo':'Payment/mo'}</span><span className="font-mono text-zinc-200">{fmtUSD(o.monthlyPayment)}</span></div>
                <div className="flex justify-between"><span>Net cash flow/mo</span><span className="font-mono" style={{ color: o.monthlyNet>=0?'#34d399':'#f87171' }}>{o.monthlyNet>=0?'+':''}{fmtUSD(o.monthlyNet)}</span></div>
                {o.srecMonthly>0 && <div className="flex justify-between"><span>+ SREC income/mo</span><span className="font-mono text-amber-400">{fmtUSD(o.srecMonthly)}</span></div>}
                <div className="flex justify-between"><span>Ownership</span><span className="text-zinc-200">{o.owns?'Yes':'No'}</span></div>
                <div className="flex justify-between"><span>30% ITC</span><span className="text-zinc-200">{o.itc?'Yes':'No'}</span></div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <Card>
        <Eyebrow>20-year net cash position by financing path</Eyebrow>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
            <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickFormatter={y=>`Yr ${y}`}/>
            <YAxis stroke="#71717a" fontSize={11} tickFormatter={v=>`$${Math.round(v/1000)}k`}/>
            <Tooltip formatter={(v,n)=>[fmtUSD(v), options.find(o=>o.id===n)?.label]} labelFormatter={y=>`Year ${y}`} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
            {options.map(o=><Line key={o.id} type="monotone" dataKey={o.id} stroke={o.color} strokeWidth={activeOpt===o.id?3:1.5} dot={false} opacity={activeOpt===o.id?1:0.45}/>)}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-zinc-600 mt-2">Includes ~0.5%/yr panel degradation. Lease and PPA payments are held flat for simplicity; real contracts typically escalate ~2.9%/yr, which roughly tracks rising utility rates. Loan and APR shown are illustrative — actual offers vary by credit and lender.{srec?` SREC/incentive-certificate income (${selState.name}'s ${srec.program}) only accrues to whoever owns the system — cash and loan customers keep it, lease and PPA customers don't, since the system isn't theirs.`:''}</p>
      </Card>

      <div className="h-px bg-zinc-800"/>

      <Eyebrow>Storm & outage backup value</Eyebrow>
      <Card>
        <div className="flex items-start gap-2 mb-3 text-xs text-zinc-400">
          <Info size={14} className="mt-0.5 text-amber-400 flex-shrink-0"/>
          <span>{selState.name} averages an estimated {outageHours} hrs/yr of grid outage exposure (storm/weather-driven, illustrative). Battery backup value below is directional — actual savings depend on outage timing and what's running.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <Field label="Battery capacity"><select className={inputCls} value={batteryKwh} onChange={e=>{ const v=Number(e.target.value); setBatteryKwh(v); setBatteryCost(v===13.5?9500:v===27?19000:4200); }}>
              <option value={5}>Enphase IQ Battery 5P — 5 kWh ($4,200)</option>
              <option value={13.5}>Tesla Powerwall 3 — 13.5 kWh ($9,500)</option>
              <option value={27}>2× Powerwall 3 — 27 kWh ($19,000)</option>
            </select></Field>
            <Field label={`Essential backup load — ${essentialLoad} kW`}><input type="range" min={0.5} max={4} step={0.1} value={essentialLoad} onChange={e=>setEssentialLoad(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
            <Field label={`Value per hour of backup — ${fmtUSD(valuePerHour)}`}><input type="range" min={5} max={50} value={valuePerHour} onChange={e=>setValuePerHour(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            <StatBlock icon={BatteryCharging} label="Backup runtime" value={`${fmtNum(backupHours)} hrs`} sub="per full charge"/>
            <StatBlock icon={Clock} label="Outage hrs covered/yr" value={`${fmtNum(coveredHours)} hrs`} sub={`of ~${outageHours} hrs typical`}/>
            <StatBlock icon={DollarSign} label="Est. annual backup value" value={fmtUSD(annualValue)}/>
            <StatBlock icon={TrendingUp} label="Battery payback (backup value only)" value={batteryPaybackYears===Infinity?'—':`${fmtNum(batteryPaybackYears)} yrs`} sub="excludes any bill-offset benefit"/>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============== AGENT TRAINING MODE ============== */
const TRAINING_PERSONAS = [
  {
    id:'skeptic', label:'The Skeptic', emoji:'🤨',
    desc:'Retired engineer, done their research, convinced solar is oversold.',
    system:`You are playing a skeptical retired engineer homeowner being pitched solar panels by a sales agent. You've done research and are skeptical of inflated claims, long paybacks, and salespeople in general. You ask hard technical questions about degradation rates, inverter warranties, net metering policy changes, and whether the savings estimates are realistic. You are not rude, but you don't let vague answers slide. If the agent gives a solid, honest, well-reasoned answer you gradually become more open. Do not break character. Keep each response to 2-4 sentences as a homeowner would speak. Start by expressing that you've "heard a lot of claims from solar companies" and seen your neighbor's system underperform.`
  },
  {
    id:'spouse', label:'The Reluctant Spouse', emoji:'😬',
    desc:'Primary earner, spouse already wants it — their job is to say no.',
    system:`You are playing a homeowner whose spouse is enthusiastic about solar but you are the reluctant one holding the family purse. You're worried about the upfront cost, being locked into a long contract, whether it'll actually work, and what happens if you sell the house. You ask practical money questions. You respond to the sales agent as if your spouse is in the room wanting you to agree but you're not fully convinced. Keep responses 2-4 sentences, conversational. Start by saying your spouse dragged you into this meeting and you "just have a few questions."`
  },
  {
    id:'budget', label:'Budget-Focused Buyer', emoji:'💰',
    desc:'Loves the idea but fixated on monthly cash flow, not total savings.',
    system:`You are a homeowner who is very budget-conscious and focused entirely on monthly cash flow. You're interested in solar but keep asking "but what does that mean for my monthly payment?" You love the idea of zero-down but worry about lease vs. loan vs. PPA differences. You ask about hidden fees, escalation clauses, what happens in months with bad weather, and whether the payment is fixed. Keep responses 2-4 sentences. Start by saying you're "all about the monthly number."`
  },
  {
    id:'techy', label:'Tech-Savvy Early Adopter', emoji:'🤓',
    desc:'Already has an EV, wants to geek out on microinverters and monitoring.',
    system:`You are a tech-savvy homeowner who already drives an EV, knows what microinverters are, and has already looked at Tesla Powerwall specs. You want to geek out on panel efficiency ratings, system monitoring APIs, battery chemistry, and whole-home backup capacity. You're likely to buy if the agent can keep up technically. You ask whether the system integrates with your home energy management system, what monitoring data you get, and whether you can export to the grid dynamically. Keep responses 2-4 sentences. Start by showing off that you already know your home's average daily kWh consumption.`
  },
  {
    id:'seller', label:'Likely to Sell in 5 Years', emoji:'🏡',
    desc:'Interested but worried solar won\'t pay off before they move.',
    system:`You are a homeowner planning to sell your home in about 5 years and are skeptical solar makes sense for you given the timeline. You keep asking about how solar affects home resale value, whether buyers will actually pay more, what happens to a lease or PPA when you sell, and whether you'll recoup the cost in 5 years. You are genuinely interested but the selling timeline is your main objection. Keep responses 2-4 sentences. Start by telling the agent upfront that you're probably moving in 4-5 years.`
  },
];

const DEBRIEF_PROMPT = (transcript, persona) =>
  `You just played the role of "${persona.label}" in a solar sales training exercise. Below is the full transcript of what the trainee agent said to you and how you responded. Now step OUT of character and give the agent honest coaching feedback. Be specific, cite actual lines from the transcript, and structure your feedback as: (1) What went well, (2) What could be stronger, (3) The one thing to fix first. Keep it under 200 words total. Transcript:\n\n${transcript}`;

function TrainingView(){
  const [personaIdx, setPersonaIdx] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [debrief, setDebrief] = useState('');
  const [debriefLoading, setDebriefLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const persona = TRAINING_PERSONAS[personaIdx];

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:'smooth' }); },[messages, loading]);

  async function startSession(){
    setMessages([]); setDebrief(''); setStarted(true); setLoading(true);
    try{
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system:persona.system, messages:[{role:"user",content:"[Session start — introduce yourself as the homeowner and open the conversation]"}] })
      });
      const data = await res.json();
      const text = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n').trim();
      setMessages([{role:'assistant',content:text,label:persona.label}]);
    }catch(e){ setMessages([{role:'assistant',content:'Could not connect — try again.',label:persona.label}]); }
    setLoading(false);
  }

  async function send(){
    if(!input.trim()||loading) return;
    const next = [...messages, {role:'user',content:input}];
    setMessages(next); setInput(''); setLoading(true);
    try{
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system:persona.system,
          messages: next.map(m=>({role:m.role,content:m.content})) })
      });
      const data = await res.json();
      const text = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n').trim();
      setMessages(m=>[...m,{role:'assistant',content:text,label:persona.label}]);
    }catch(e){ setMessages(m=>[...m,{role:'assistant',content:'Connection error — try again.',label:persona.label}]); }
    setLoading(false);
  }

  async function getDebrief(){
    if(messages.length<2) return;
    setDebriefLoading(true); setDebrief('');
    const transcript = messages.map(m=>`${m.role==='user'?'AGENT':'CUSTOMER'}: ${m.content}`).join('\n\n');
    try{
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{role:"user",content:DEBRIEF_PROMPT(transcript, persona)}] })
      });
      const data = await res.json();
      setDebrief((data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n').trim());
    }catch(e){ setDebrief('Could not generate debrief — try again.'); }
    setDebriefLoading(false);
  }

  function reset(){ setMessages([]); setDebrief(''); setStarted(false); setInput(''); }

  return (
    <div className="space-y-4">
      <Eyebrow>Agent training mode — AI simulated customer</Eyebrow>
      {!started ? (
        <>
          <Card><p className="text-sm text-zinc-400">Practice a full solar pitch against a realistic customer persona before going live. The AI stays in character — give vague answers and it'll push back. Give strong ones and it'll warm up. When you're done, request a coaching debrief.</p></Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TRAINING_PERSONAS.map((p,i)=>(
              <button key={p.id} onClick={()=>setPersonaIdx(i)} className="text-left">
                <Card className={`h-full transition ${personaIdx===i?'border-amber-500/60':'hover:border-zinc-700'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{p.emoji}</span>
                    <div className="font-semibold text-zinc-100">{p.label}</div>
                  </div>
                  <p className="text-xs text-zinc-500">{p.desc}</p>
                </Card>
              </button>
            ))}
          </div>
          <Btn icon={GraduationCap} onClick={startSession}>Start session with {persona.emoji} {persona.label}</Btn>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-zinc-300"><span className="text-lg">{persona.emoji}</span> Playing: <span className="font-semibold text-amber-400">{persona.label}</span></div>
            <div className="flex gap-2">
              {messages.length>=4 && <Btn variant="outline" icon={Sparkles} onClick={getDebrief} disabled={debriefLoading}>{debriefLoading?'Analysing…':'Get coaching debrief'}</Btn>}
              <Btn variant="ghost" icon={RotateCcw} onClick={reset}>New session</Btn>
            </div>
          </div>
          <Card className="flex flex-col" style={{height:400}}>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((m,i)=>(
                <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${m.role==='user'?'bg-amber-500 text-zinc-950':'bg-zinc-800 text-zinc-200'}`}>
                    {m.role==='assistant' && <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">{persona.emoji} {persona.label}</div>}
                    <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-zinc-800 text-zinc-500 rounded-xl px-3.5 py-2.5 text-sm">{persona.emoji} thinking…</div></div>}
              <div ref={bottomRef}/>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800">
              <input className={inputCls} placeholder="Your pitch or response…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} disabled={loading}/>
              <Btn icon={Send} onClick={send} disabled={loading||!input.trim()}>Send</Btn>
            </div>
          </Card>
          {debrief && (
            <Card className="border-amber-500/30">
              <Eyebrow>Coaching debrief</Eyebrow>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{debrief}</p>
            </Card>
          )}
        </>
      )}
      <p className="text-[11px] text-zinc-600">Training sessions are not saved. The AI stays in character until you request a debrief — treat it like a real customer and you'll get the most out of it.</p>
    </div>
  );
}

/* ============== AI OBJECTION CO-PILOT ============== */
const COPILOT_SYSTEM = "You are a solar sales coach helping a live sales agent handle real-time customer objections and questions during an in-home or phone solar pitch. The agent will describe an objection, question, or situation the customer raised. Respond with a short, practical talking-point script (2-5 sentences) the agent can say back to the customer, grounded in accurate solar industry knowledge — financing options (cash, loan, lease, PPA), the 30% federal ITC, the fact that net metering and buyback policy vary significantly by state and utility, roof age/warranty interactions with reroofing, equipment quality and degradation, and realistic expectations. Be concise and conversational, like a script line, not a lecture. If the objection touches something agents shouldn't overpromise — guaranteed savings, buyback rates, or a specific dollar figure without knowing the customer's location — gently build that caution into the suggested response rather than ignoring it. Address the agent directly with the talking point; do not greet the customer.";
const QUICK_OBJECTIONS = [
  "It's too expensive",
  "My roof is too old",
  "I'm renting / might move soon",
  "My HOA won't allow it",
  "I need to think about it",
  "I heard solar leases are a scam",
  "What happens when panels need replacing?",
  "Will this affect my home insurance?",
];
function CoPilotView(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:'smooth' }); },[messages, loading]);

  async function send(text){
    const content = (text ?? input).trim();
    if(!content || loading) return;
    const next = [...messages, { role:'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError('');
    try{
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system: COPILOT_SYSTEM,
          messages: next.map(m=>({ role:m.role, content:m.content })),
        })
      });
      if(!response.ok) throw new Error('Request failed');
      const data = await response.json();
      const text2 = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n').trim();
      setMessages(m=>[...m, { role:'assistant', content: text2 || "Didn't get a usable response — try rephrasing the objection." }]);
    }catch(e){
      setError("Couldn't reach the AI co-pilot just now. Try again in a moment.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Eyebrow>AI live objection-handling co-pilot</Eyebrow>
      <Card>
        <p className="text-sm text-zinc-400">Type what the customer just said — an objection, a question, a stall tactic — and get a talking point grounded in real solar sales knowledge. Built for use mid-pitch, on the spot.</p>
      </Card>
      <div className="flex gap-2 flex-wrap">
        {QUICK_OBJECTIONS.map(q=>(
          <button key={q} onClick={()=>send(q)} disabled={loading} className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40">{q}</button>
        ))}
      </div>
      <Card className="flex flex-col" style={{ height:420 }}>
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length===0 && <p className="text-sm text-zinc-500">No objections yet — type one below or tap a quick one above.</p>}
          {messages.map((m,i)=>(
            <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${m.role==='user'?'bg-amber-500 text-zinc-950':'bg-zinc-800 text-zinc-200'}`}>
                {m.role==='assistant' && <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-amber-400 mb-1"><Bot size={11}/> Co-pilot suggests</div>}
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 text-zinc-500 rounded-xl px-3.5 py-2.5 text-sm">Thinking…</div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
        <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800">
          <input className={inputCls} placeholder="What did the customer say?" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} disabled={loading}/>
          <Btn icon={Send} onClick={()=>send()} disabled={loading || !input.trim()}>Send</Btn>
        </div>
      </Card>
      {messages.length>0 && <Btn variant="ghost" icon={RotateCcw} onClick={()=>{ setMessages([]); setError(''); }}>Clear conversation</Btn>}
      <p className="text-[11px] text-zinc-600">This calls Claude live — responses are real-time AI coaching, not a canned script. Always verify state-specific incentive, tax, and legal details before quoting a customer.</p>
    </div>
  );
}

/* ============== CUSTOMER SELF-SERVICE PORTAL ============== */
function buildProductionHistory(prospect){
  const avgDaily = (prospect.calc.monthlyProd)/30;
  const data=[];
  for(let day=1; day<=30; day++){
    const seed = strHash(prospect.id+'_day'+day);
    const factor = 0.7 + ((Math.sin(seed)+1)/2)*0.6;
    data.push({ day, actual: Math.round(avgDaily*factor*10)/10, promised: Math.round(avgDaily*10)/10 });
  }
  return data;
}
function CustomerPortalView({ prospects, selectedId, setSelectedId, onToast }){
  const prospect = prospects.find(p=>p.id===selectedId);
  if(!prospect){
    return (
      <div className="space-y-3">
        <Eyebrow>Customer self-service portal (preview)</Eyebrow>
        <Card>
          <p className="text-sm text-zinc-500 mb-3">Select a prospect to preview what their customer-facing portal would look like.</p>
          <div className="space-y-2">
            {prospects.map(p=>(
              <button key={p.id} onClick={()=>setSelectedId(p.id)} className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 flex justify-between">
                <span>{p.name}</span><span className="text-zinc-500">{p.stage}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  const calc = prospect.calc;
  const history = buildProductionHistory(prospect);
  const totalActual = history.reduce((s,d)=>s+d.actual,0);
  const totalPromised = history.reduce((s,d)=>s+d.promised,0);
  const perfPct = Math.round((totalActual/totalPromised)*100);
  const stageIdx = STAGES.indexOf(prospect.stage);
  const docChecklist = [
    { label:'Proposal sent', done: prospect.documents.some(d=>d.type==='Proposal') },
    { label:'Service agreement executed', done: prospect.documents.some(d=>d.type==='Service Agreement' && d.status==='executed') },
    { label:'Equipment ordered', done: prospect.documents.some(d=>d.type==='Equipment Order Form') },
    { label:'Invoice issued', done: prospect.documents.some(d=>d.type==='Invoice') },
  ];
  const isLive = stageIdx>=STAGES.indexOf('Installed');

  return (
    <div className="space-y-5">
      <button onClick={()=>setSelectedId(null)} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All prospects</button>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Eyebrow>Customer self-service portal (preview)</Eyebrow>
        <Btn variant="outline" icon={Share2} onClick={()=>onToast('Portal link copied — shareable with customer (demo)')}>Share with customer</Btn>
      </div>
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 to-amber-950/20 p-6">
        <h2 className="text-xl font-bold text-zinc-50">Welcome, {prospect.name.split(' ')[0]}</h2>
        <p className="text-zinc-400 text-sm">{prospect.address}, {prospect.city}, {prospect.state}</p>
      </div>

      <Card>
        <Eyebrow>Project status</Eyebrow>
        <div className="flex items-center overflow-x-auto pb-1">
          {STAGES.map((s,i)=>(
            <div key={s} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center w-24">
                {i<=stageIdx ? <CheckCircle2 size={18} className="text-amber-400"/> : <Circle size={18} className="text-zinc-700"/>}
                <div className={`text-[10px] text-center mt-1 ${i<=stageIdx?'text-zinc-300':'text-zinc-600'}`}>{s}</div>
              </div>
              {i<STAGES.length-1 && <div className={`h-px w-6 ${i<stageIdx?'bg-amber-500/60':'bg-zinc-800'}`}/>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><StatBlock icon={Zap} label="System size" value={`${fmtNum(calc.systemKw,2)} kW`}/></Card>
        <Card><StatBlock icon={DollarSign} label="Projected monthly benefit" value={fmtUSD(calc.totalMonthly+(prospect.srec?prospect.srec.monthly:0))}/></Card>
        <Card><StatBlock icon={Clock} label="Current stage" value={prospect.stage}/></Card>
        <Card><StatBlock icon={CheckCircle2} label="Documents complete" value={`${docChecklist.filter(d=>d.done).length}/${docChecklist.length}`}/></Card>
      </div>

      <Card>
        <Eyebrow>{isLive?'Actual vs. promised production (last 30 days)':'Simulated production preview (activates once installed)'}</Eyebrow>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
            <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickFormatter={d=>`D${d}`}/>
            <YAxis stroke="#71717a" fontSize={10} tickFormatter={v=>`${v}kWh`}/>
            <Tooltip formatter={v=>`${v} kWh`} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
            <Line type="monotone" dataKey="promised" stroke="#71717a" strokeWidth={1.5} dot={false} strokeDasharray="4 3" name="Promised"/>
            <Line type="monotone" dataKey="actual" stroke={isLive?'#34d399':'#fbbf24'} strokeWidth={2.5} dot={false} name="Actual"/>
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
          <span>Performance vs. promise</span>
          <span className={`font-mono ${perfPct>=95?'text-emerald-400':perfPct>=85?'text-amber-400':'text-red-400'}`}>{perfPct}%</span>
        </div>
      </Card>

      <Card>
        <Eyebrow>Paperwork checklist</Eyebrow>
        <div className="space-y-2">
          {docChecklist.map(d=>(
            <div key={d.label} className="flex items-center gap-2 text-sm">
              {d.done ? <CheckCircle2 size={15} className="text-emerald-400"/> : <Circle size={15} className="text-zinc-600"/>}
              <span className={d.done?'text-zinc-300':'text-zinc-500'}>{d.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <p className="text-[11px] text-zinc-600">This is a preview of the customer-facing experience rendered inside the agent console. A production build would put this behind its own customer login, and the production chart would pull live data from the inverter manufacturer's monitoring API (e.g. Enphase Enlighten, SolarEdge) instead of a simulation.</p>
    </div>
  );
}

/* ============== PERMIT & HOA TRACKER ============== */
function PermitHoaView({ prospects, selectedId, setSelectedId, onToggleStep, onUpdateHoa, onGenerateLetter, setView }){
  const prospect = prospects.find(p=>p.id===selectedId);
  if(!prospect){
    return (
      <div className="space-y-3">
        <Eyebrow>Permit & HOA tracker</Eyebrow>
        <Card>
          <p className="text-sm text-zinc-500 mb-3">Select a prospect to track their permitting and HOA approval progress.</p>
          <div className="space-y-2">
            {prospects.map(p=>(
              <button key={p.id} onClick={()=>setSelectedId(p.id)} className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 flex justify-between">
                <span>{p.name}</span><span className="text-zinc-500">{p.city}, {p.state}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  const stMatch = STATES.find(s=>s.name.toLowerCase()===prospect.state.toLowerCase());
  const permitWeeks = getPermitWeeks(stMatch?.abbr);
  const steps = prospect.permit?.steps || {};
  const completedCount = PERMIT_STEPS.filter(s=>steps[s]).length;
  const expectedDate = new Date(prospect.createdAt + permitWeeks*7*24*60*60*1000);
  const hoa = prospect.hoa || { required:false, status:'Not submitted' };
  const hoaLetters = prospect.documents.filter(d=>d.type==='HOA Approval Letter');

  return (
    <div className="space-y-5">
      <button onClick={()=>setSelectedId(null)} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All prospects</button>
      <Eyebrow>{prospect.name} — permit & HOA tracker</Eyebrow>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-zinc-300">{prospect.city}, {prospect.state} typically runs <span className="font-mono text-amber-400">~{permitWeeks} wks</span> for permit + interconnection</div>
          <div className="text-xs text-zinc-500">Est. PTO by {expectedDate.toLocaleDateString()}</div>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width:`${(completedCount/PERMIT_STEPS.length)*100}%` }}/>
        </div>
        <div className="text-xs text-zinc-500 mt-1">{completedCount} of {PERMIT_STEPS.length} steps complete</div>
      </Card>

      <Card>
        <Eyebrow>Permit & interconnection checklist</Eyebrow>
        <div className="space-y-2">
          {PERMIT_STEPS.map(step=>(
            <label key={step} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" checked={!!steps[step]} onChange={()=>onToggleStep(prospect.id, step)} className="accent-amber-500"/>
              <span className={steps[step]?'text-zinc-300 line-through':'text-zinc-300'}>{step}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <Eyebrow>HOA status</Eyebrow>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer mb-3">
          <input type="checkbox" checked={hoa.required} onChange={e=>onUpdateHoa(prospect.id, { required:e.target.checked })} className="accent-amber-500"/>
          <span className="text-zinc-300">Property is in an HOA</span>
        </label>
        {hoa.required && (
          <div className="space-y-3">
            <Field label="Approval status">
              <select className={inputCls} value={hoa.status} onChange={e=>onUpdateHoa(prospect.id, { status:e.target.value })}>
                {['Not submitted','Submitted','Approved','Denied'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Btn variant="outline" icon={ClipboardCheck} onClick={()=>onGenerateLetter(prospect.id)}>Generate HOA approval letter</Btn>
            {hoaLetters.length>0 && (
              <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400"/> {hoaLetters.length} letter{hoaLetters.length>1?'s':''} generated — view in <button onClick={()=>setView('documents')} className="text-amber-400 hover:underline">Documents</button>
              </div>
            )}
            {hoa.status==='Denied' && (
              <div className="flex items-start gap-2 text-xs text-zinc-400 bg-zinc-800 rounded-lg p-3">
                <Info size={13} className="text-amber-400 mt-0.5 flex-shrink-0"/>
                Many states have "solar access laws" that limit an HOA's ability to outright deny a reasonably-sited solar installation — worth checking {prospect.state}'s specific statute before treating a denial as final.
              </div>
            )}
          </div>
        )}
      </Card>
      <p className="text-[11px] text-zinc-600">Permit timelines and HOA rules vary by jurisdiction and utility — these figures are illustrative starting points, not a substitute for checking the local AHJ and utility interconnection requirements.</p>
    </div>
  );
}

/* ============== 3D ROOF VIEWER ============== */
function RoofViewer(){
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [pitch, setPitch] = useState(25);
  const [azimuth, setAzimuth] = useState(180);
  const [width, setWidth] = useState(32);
  const [depth, setDepth] = useState(22);
  const [hour, setHour] = useState(12.5);
  const [exposure, setExposure] = useState(0);
  const [panelCount, setPanelCount] = useState(0);

  useEffect(()=>{
    const mount = mountRef.current;
    const w0 = mount.clientWidth, h0 = 360;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1a2e);
    const camera = new THREE.PerspectiveCamera(45, w0/h0, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setSize(w0,h0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404060, 1.1));
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
    scene.add(sunLight); scene.add(sunLight.target);
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2,16,16), new THREE.MeshBasicMaterial({ color:0xffcc55 }));
    scene.add(sunMesh);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(220,220), new THREE.MeshStandardMaterial({ color:0x33402f }));
    ground.rotation.x = -Math.PI/2; ground.position.y = -0.02;
    scene.add(ground);
    const houseBody = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({ color:0x77706a }));
    scene.add(houseBody);
    const roofGroup = new THREE.Group();
    scene.add(roofGroup);
    const roofPlane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshStandardMaterial({ color:0x4a4540, side: THREE.DoubleSide }));
    roofGroup.add(roofPlane);
    const panelGroup = new THREE.Group();
    roofGroup.add(panelGroup);

    sceneRef.current = { scene, camera, renderer, sunLight, sunMesh, houseBody, roofGroup, roofPlane, panelGroup };

    let camAzimuth=0.7, camElevation=0.55, camDistance=64, dragging=false, lastX=0, lastY=0;
    function updateCamera(){
      camera.position.set(
        camDistance*Math.cos(camElevation)*Math.sin(camAzimuth),
        camDistance*Math.sin(camElevation),
        camDistance*Math.cos(camElevation)*Math.cos(camAzimuth)
      );
      camera.lookAt(0,5,0);
    }
    updateCamera();
    function onDown(e){ dragging=true; lastX=e.clientX; lastY=e.clientY; }
    function onUp(){ dragging=false; }
    function onMove(e){
      if(!dragging) return;
      camAzimuth -= (e.clientX-lastX)*0.01;
      camElevation = Math.min(1.45, Math.max(0.08, camElevation+(e.clientY-lastY)*0.008));
      lastX=e.clientX; lastY=e.clientY;
      updateCamera();
    }
    function onWheel(e){ e.preventDefault(); camDistance = Math.min(150, Math.max(22, camDistance+e.deltaY*0.05)); updateCamera(); }
    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    dom.addEventListener('wheel', onWheel, { passive:false });

    let raf;
    function animate(){ raf=requestAnimationFrame(animate); renderer.render(scene,camera); }
    animate();

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('mousedown', onDown);
      if(mount.contains(dom)) mount.removeChild(dom);
      renderer.dispose();
    };
  },[]);

  useEffect(()=>{
    const s = sceneRef.current;
    if(!s.roofGroup) return;
    const houseHeight = 8;
    s.houseBody.geometry.dispose();
    s.houseBody.geometry = new THREE.BoxGeometry(width, houseHeight, depth);
    s.houseBody.position.set(0, houseHeight/2, 0);
    s.roofPlane.geometry.dispose();
    s.roofPlane.geometry = new THREE.PlaneGeometry(width*1.05, depth*1.15);
    s.roofGroup.position.set(0, houseHeight, 0);
    s.roofGroup.rotation.set(-Math.PI/2 + THREE.MathUtils.degToRad(pitch), THREE.MathUtils.degToRad(azimuth), 0);

    while(s.panelGroup.children.length){ const c=s.panelGroup.children.pop(); c.geometry.dispose(); c.material.dispose(); }
    const panelW=3.25, panelH=5.4, gap=0.3;
    const cols = Math.max(1, Math.floor((width*0.88)/(panelW+gap)));
    const rows = Math.max(1, Math.floor((depth*0.9)/(panelH+gap)));
    const totalW = cols*(panelW+gap)-gap, totalD = rows*(panelH+gap)-gap;
    const panelMat = new THREE.MeshStandardMaterial({ color:0x16213a, metalness:0.4, roughness:0.35 });
    for(let r=0;r<rows;r++){
      for(let c2=0;c2<cols;c2++){
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(panelW,panelH), panelMat);
        mesh.position.set(-totalW/2+c2*(panelW+gap)+panelW/2, -totalD/2+r*(panelH+gap)+panelH/2, 0.08);
        s.panelGroup.add(mesh);
      }
    }
    setPanelCount(rows*cols);

    const maxAlt = 65;
    const t = Math.max(0, Math.min(1, (hour-6)/12));
    const altitudeDeg = Math.max(2, Math.sin(Math.PI*t)*maxAlt);
    const azimuthDeg = -90 + t*180;
    const alt = THREE.MathUtils.degToRad(altitudeDeg), az = THREE.MathUtils.degToRad(azimuthDeg), R=85;
    const x = R*Math.cos(alt)*Math.sin(az), y = R*Math.sin(alt), z = R*Math.cos(alt)*Math.cos(az);
    s.sunLight.position.set(x,y,z);
    s.sunLight.target.position.set(0,5,0);
    s.sunMesh.position.set(x,y,z);
    s.sunLight.intensity = Math.max(0.15, Math.sin(alt))*1.8;
    s.scene.background = new THREE.Color((hour<6.5||hour>18.5)?0x05060a:(hour<8||hour>17)?0x3a2a1a:0x0d1a2e);
    const normal = new THREE.Vector3(0,0,1).applyQuaternion(s.roofGroup.quaternion).normalize();
    const lightDir = new THREE.Vector3(x,y,z).normalize();
    setExposure(Math.round(Math.max(0, normal.dot(lightDir))*100));
  },[pitch,azimuth,width,depth,hour]);

  const exposureNote = exposure>=80?'Optimal direct exposure':exposure>=50?'Good exposure':exposure>=20?'Reduced exposure — consider orientation':'Minimal exposure at this angle';

  return (
    <div className="space-y-4">
      <Eyebrow>3D roof model & sun path</Eyebrow>
      <Card className="p-0 overflow-hidden">
        <div ref={mountRef} className="w-full" style={{ height: 360 }} />
      </Card>
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatBlock icon={Box} label="Roof panels fit" value={panelCount}/>
          <StatBlock icon={Sun} label="Sun exposure now" value={`${exposure}%`} sub={exposureNote}/>
          <StatBlock icon={Zap} label="Est. array size" value={`${fmtNum(panelCount*0.43,1)} kW`} sub="430W panels"/>
          <StatBlock icon={Clock} label="Time of day" value={`${Math.floor(hour)}:${hour%1===0?'00':'30'}`}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label={`Roof pitch — ${pitch}°`}><input type="range" min={5} max={50} value={pitch} onChange={e=>setPitch(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
          <Field label={`Orientation — ${azimuth}°${azimuth===180?' (due south)':azimuth===0?' (due north)':''}`}><input type="range" min={0} max={359} value={azimuth} onChange={e=>setAzimuth(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
          <Field label={`Roof width — ${width} ft`}><input type="range" min={16} max={60} value={width} onChange={e=>setWidth(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
          <Field label={`Roof depth — ${depth} ft`}><input type="range" min={12} max={50} value={depth} onChange={e=>setDepth(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
          <Field label={`Sun position — hour ${hour.toFixed(1)}`}><input type="range" min={6} max={18.5} step={0.1} value={hour} onChange={e=>setHour(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
        </div>
        <p className="text-[11px] text-zinc-600 mt-3">Drag to orbit · scroll to zoom. Real deployments should source roof geometry from a measured survey or aerial/LIDAR data (e.g. Google's Solar API) rather than manual sliders.</p>
      </Card>
    </div>
  );
}

/* ============== ONBOARDING ============== */
function OnboardingView({ prefill, onCreate, setView }){
  const [form, setForm] = useState({
    name:'', email:'', phone:'', address:'',
    state: prefill?.state || 'California', city: prefill?.city || 'Los Angeles',
    billMonthly: prefill?.billMonthly || 150,
    roofWidth:32, roofDepth:22, roofPitch:25, roofAzimuth:180, shadingPct:10, plansBattery:false, notes:'',
  });
  const set = (k,v)=>setForm(f=>({ ...f, [k]:v }));
  function submit(){ if(!form.name || !form.address) return; onCreate(form); setView('portfolio'); }
  return (
    <div className="space-y-5 max-w-2xl">
      <Eyebrow>New prospect onboarding</Eyebrow>
      <Card>
        <div className="text-sm font-semibold text-zinc-200 mb-3">Customer</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Full name"><input className={inputCls} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Jordan Mitchell"/></Field>
          <Field label="Property address"><input className={inputCls} value={form.address} onChange={e=>set('address',e.target.value)} placeholder="142 Sycamore Ln"/></Field>
          <Field label="Email"><input className={inputCls} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="jordan@email.com"/></Field>
          <Field label="Phone"><input className={inputCls} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="(555) 010-0199"/></Field>
        </div>
      </Card>
      <Card>
        <div className="text-sm font-semibold text-zinc-200 mb-3">Location</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="State"><input className={inputCls} value={form.state} onChange={e=>set('state',e.target.value)}/></Field>
          <Field label="City"><input className={inputCls} value={form.city} onChange={e=>set('city',e.target.value)}/></Field>
        </div>
      </Card>
      <Card>
        <div className="text-sm font-semibold text-zinc-200 mb-3">Property & roof</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Avg. monthly electric bill ($)"><input type="number" className={inputCls} value={form.billMonthly} onChange={e=>set('billMonthly',Number(e.target.value))}/></Field>
          <Field label="Shading obstruction (%)"><input type="number" className={inputCls} value={form.shadingPct} onChange={e=>set('shadingPct',Number(e.target.value))}/></Field>
          <Field label="Roof width (ft)"><input type="number" className={inputCls} value={form.roofWidth} onChange={e=>set('roofWidth',Number(e.target.value))}/></Field>
          <Field label="Roof depth (ft)"><input type="number" className={inputCls} value={form.roofDepth} onChange={e=>set('roofDepth',Number(e.target.value))}/></Field>
          <Field label="Roof pitch (degrees)"><input type="number" className={inputCls} value={form.roofPitch} onChange={e=>set('roofPitch',Number(e.target.value))}/></Field>
          <Field label="Roof azimuth (0-359°, 180=south)"><input type="number" className={inputCls} value={form.roofAzimuth} onChange={e=>set('roofAzimuth',Number(e.target.value))}/></Field>
        </div>
        <label className="flex items-center gap-2 mt-3 text-xs text-zinc-300 cursor-pointer">
          <input type="checkbox" checked={form.plansBattery} onChange={e=>set('plansBattery',e.target.checked)} className="accent-amber-500"/>
          Customer plans to add battery storage (matters for TOU-rate markets)
        </label>
      </Card>
      <Card><Field label="Agent notes"><textarea className={inputCls} rows={3} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Roof in good condition, south-facing, customer interested in battery backup..."/></Field></Card>
      <Btn icon={Sparkles} onClick={submit}>Create prospect & generate portfolio</Btn>
    </div>
  );
}

/* ============== PORTFOLIO ============== */
function PortfolioView({ prospects, selectedId, setSelectedId, onToast, setView }){
  const prospect = prospects.find(p=>p.id===selectedId);
  if(!prospect){
    return (
      <div className="space-y-3">
        <Eyebrow>Digital portfolio</Eyebrow>
        <Card>
          <p className="text-sm text-zinc-500 mb-3">Select a prospect to view their generated portfolio.</p>
          <div className="space-y-2">
            {prospects.map(p=>(
              <button key={p.id} onClick={()=>setSelectedId(p.id)} className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 flex justify-between">
                <span>{p.name}</span><span className="text-zinc-500">{p.city}, {p.state}</span>
              </button>
            ))}
            {prospects.length===0 && <Btn icon={UserPlus} variant="outline" onClick={()=>setView('onboarding')}>Create your first prospect</Btn>}
          </div>
        </Card>
      </div>
    );
  }
  const calc = prospect.calc;
  const srec = prospect.srec;
  const projection = buildProjection(calc, srec, 3.5); // 3.5% utility rate escalation default
  return (
    <div className="space-y-5">
      <button onClick={()=>setSelectedId(null)} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All prospects</button>
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 to-amber-950/20 p-6">
        <Eyebrow>Digital portfolio</Eyebrow>
        <h2 className="text-2xl font-bold text-zinc-50">{prospect.name}</h2>
        <p className="text-zinc-400 text-sm">{prospect.address}, {prospect.city}, {prospect.state}</p>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <ScoreBadge score={scoreOf({ sunHours:prospect.sunHours, consistentDays:prospect.consistentDays, bill:prospect.billMonthly, rate:prospect.rate })}/>
          {prospect.touFactor!=null && prospect.touFactor<1 && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 flex items-center gap-1">
              <AlertTriangle size={11} className="text-amber-400"/> TOU-adjusted — {prospect.plansBattery?'battery included':`no battery, ~${Math.round(prospect.touFactor*100)}% value capture`}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><StatBlock icon={Zap} label="Recommended system" value={`${fmtNum(calc.systemKw,2)} kW`}/></Card>
        <Card><StatBlock icon={DollarSign} label="Monthly benefit" value={fmtUSD(calc.totalMonthly + (srec?srec.monthly:0))} sub={srec?`incl. ${fmtUSD(srec.monthly)} SREC`:undefined}/></Card>
        <Card><StatBlock icon={Clock} label="Payback" value={`${fmtNum(calc.paybackYears)} yrs`}/></Card>
        <Card><StatBlock icon={TrendingUp} label="25-yr net" value={fmtUSD(projection[25].value)}/></Card>
      </div>
      <Card>
        <Eyebrow>Projected savings</Eyebrow>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={projection}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
            <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickFormatter={y=>`Yr ${y}`}/>
            <YAxis stroke="#71717a" fontSize={11} tickFormatter={v=>`$${Math.round(v/1000)}k`}/>
            <Tooltip formatter={v=>fmtUSD(v)} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
            <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2.5} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <Eyebrow>Roof & install snapshot</Eyebrow>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBlock label="Dimensions" value={`${prospect.roof.widthFt}×${prospect.roof.depthFt} ft`}/>
          <StatBlock label="Pitch" value={`${prospect.roof.pitchDeg}°`}/>
          <StatBlock label="Orientation" value={`${prospect.roof.azimuthDeg}°`}/>
          <StatBlock label="Shading" value={`${prospect.roof.shadingPct}%`}/>
        </div>
        <p className="text-xs text-zinc-500 mt-3">Open the Roof Viewer tab and dial in these exact specs to walk the customer through the panel layout and sun path live.</p>
      </Card>
      <div className="flex gap-2 flex-wrap">
        <Btn icon={Send} onClick={()=>onToast(`Portfolio sent to ${prospect.email||'customer'} (demo)`)}>Send portfolio to customer</Btn>
        <Btn variant="outline" icon={FileSignature} onClick={()=>setView('documents')}>Open documents</Btn>
        <Btn variant="outline" icon={ShoppingCart} onClick={()=>setView('equipment')}>Order equipment</Btn>
      </div>
    </div>
  );
}

/* ============== EQUIPMENT ============== */
function EquipmentView({ prospects, selectedId, setSelectedId, onPlaceOrder, onToast }){
  const [cart, setCart] = useState([]);
  const prospect = prospects.find(p=>p.id===selectedId);
  const add = (item)=> setCart(c=>{
    const existing = c.find(x=>x.id===item.id);
    if(existing) return c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x);
    return [...c, {...item, qty:1}];
  });
  const updateQty = (id,delta)=> setCart(c=>c.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+delta)}:x).filter(x=>x.qty>0));
  const remove = (id)=> setCart(c=>c.filter(x=>x.id!==id));
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  return (
    <div className="space-y-5">
      <Eyebrow>Equipment ordering — approved distributors</Eyebrow>
      <Card>
        <Field label="Attach order to prospect">
          <select className={inputCls} value={selectedId||''} onChange={e=>setSelectedId(e.target.value||null)}>
            <option value="">No prospect selected</option>
            {prospects.map(p=><option key={p.id} value={p.id}>{p.name} — {p.city}, {p.state}</option>)}
          </select>
        </Field>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CATALOG.map(item=>(
          <Card key={item.id} className="flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-500/80 uppercase tracking-wide">{item.cat} · {item.distributor}</div>
              <div className="font-medium text-zinc-100">{item.name}</div>
              <div className="text-xs text-zinc-500">{item.spec}</div>
              <div className="font-mono text-amber-400 mt-1">{fmtUSD(item.price)}</div>
            </div>
            <Btn variant="outline" icon={Plus} onClick={()=>add(item)}>Add</Btn>
          </Card>
        ))}
      </div>
      <Card>
        <Eyebrow>Cart</Eyebrow>
        {cart.length===0 ? <p className="text-sm text-zinc-500">No items yet.</p> : (
          <div className="space-y-2">
            {cart.map(item=>(
              <div key={item.id} className="flex items-center justify-between text-sm border-b border-zinc-800 pb-2">
                <div className="text-zinc-200">{item.name}</div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>updateQty(item.id,-1)} className="p-1 rounded bg-zinc-800"><Minus size={12}/></button>
                  <span className="font-mono w-6 text-center">{item.qty}</span>
                  <button onClick={()=>updateQty(item.id,1)} className="p-1 rounded bg-zinc-800"><Plus size={12}/></button>
                  <span className="font-mono text-amber-400 w-20 text-right">{fmtUSD(item.price*item.qty)}</span>
                  <button onClick={()=>remove(item.id)} className="text-zinc-600 hover:text-red-400"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold text-zinc-100"><span>Total</span><span className="font-mono text-amber-400">{fmtUSD(total)}</span></div>
          </div>
        )}
        <Btn className="mt-4" icon={ShoppingCart} disabled={cart.length===0 || !prospect} onClick={()=>{
          onPlaceOrder(prospect.id, cart, total);
          setCart([]);
          onToast(`Order placed for ${prospect.name} — ${fmtUSD(total)} (demo)`);
        }}>Place order{!prospect && cart.length>0 ? ' (select a prospect first)':''}</Btn>
      </Card>
    </div>
  );
}

/* ============== SIGNATURE PAD ============== */
function SignaturePad({ onSave }){
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  useEffect(()=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0b'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  },[]);
  function pos(e){
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return [cx-rect.left, cy-rect.top];
  }
  function start(e){ drawingRef.current=true; const ctx=canvasRef.current.getContext('2d'); const [x,y]=pos(e); ctx.beginPath(); ctx.moveTo(x,y); }
  function move(e){ if(!drawingRef.current) return; const ctx=canvasRef.current.getContext('2d'); const [x,y]=pos(e); ctx.lineTo(x,y); ctx.stroke(); }
  function end(){ drawingRef.current=false; }
  function clear(){ const canvas=canvasRef.current; const ctx=canvas.getContext('2d'); ctx.fillStyle='#0a0a0b'; ctx.fillRect(0,0,canvas.width,canvas.height); }
  return (
    <div>
      <canvas ref={canvasRef} width={400} height={130} className="w-full bg-zinc-950 rounded-lg border border-zinc-800 touch-none"
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}/>
      <div className="flex gap-2 mt-2">
        <Btn variant="ghost" icon={RotateCcw} onClick={clear}>Clear</Btn>
        <Btn icon={Save} onClick={()=>onSave(canvasRef.current.toDataURL())}>Save signature</Btn>
      </div>
    </div>
  );
}

/* ============== DOCUMENTS ============== */
function docBody(type, p){
  const calc = p.calc;
  if(type==='Proposal') return `Solar proposal for ${p.address}, ${p.city}, ${p.state}. Recommended system: ${fmtNum(calc.systemKw,2)} kW, projected to offset the majority of current usage with an estimated total monthly benefit of ${fmtUSD(calc.totalMonthly)} (bill offset + surplus buyback). Estimated payback period: ${fmtNum(calc.paybackYears)} years after the 30% federal tax credit.`;
  if(type==='Service Agreement') return `This Solar Installation Service Agreement is entered into between the agency and ${p.name} for installation of a ${fmtNum(calc.systemKw,2)} kW solar system at ${p.address}. Net system price: ${fmtUSD(calc.net)}. Estimated install timeline: 6-10 weeks from permitting. Workmanship warranty: 10 years. Sample template for demonstration — execute final agreements through a licensed contract and e-signature provider.`;
  if(type==='Equipment Order Form') return `Equipment order summary attached to ${p.name}'s project at ${p.address}. See itemized list and distributor breakdown below.`;
  if(type==='Invoice') return `Invoice for services and equipment rendered to ${p.name}, ${p.address}. Includes equipment subtotal, installation service fee, and applicable totals.`;
  return '';
}

function DocumentsView({ prospects, selectedId, setSelectedId, onUpdateDoc, onToast }){
  const prospect = prospects.find(p=>p.id===selectedId);
  const [activeDocId, setActiveDocId] = useState(null);
  const [role, setRole] = useState('agent');
  if(!prospect){
    return (
      <div className="space-y-3">
        <Eyebrow>Documents & e-signature</Eyebrow>
        <Card>
          <p className="text-sm text-zinc-500 mb-3">Select a prospect to view their document folder.</p>
          <div className="space-y-2">
            {prospects.map(p=>(
              <button key={p.id} onClick={()=>setSelectedId(p.id)} className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 flex justify-between">
                <span>{p.name}</span><span className="text-zinc-500">{p.documents.length} docs</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  const doc = prospect.documents.find(d=>d.id===activeDocId) || prospect.documents[0];
  return (
    <div className="space-y-5">
      <button onClick={()=>{ setSelectedId(null); setActiveDocId(null); }} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All prospects</button>
      <Eyebrow>{prospect.name} — document folder</Eyebrow>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <div className="space-y-1.5">
            {prospect.documents.map(d=>(
              <button key={d.id} onClick={()=>setActiveDocId(d.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${doc?.id===d.id?'bg-amber-500/15 text-amber-300':'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                <span className="flex items-center gap-2"><FileText size={14}/> {d.type}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.status==='executed'||d.status==='completed'?'bg-emerald-900 text-emerald-300':d.status==='partially_signed'?'bg-amber-900 text-amber-300':'bg-zinc-700 text-zinc-400'}`}>{d.status}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="md:col-span-2">
          {doc ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-100">{doc.type}</h3>
                <div className="flex gap-1.5">
                  <button onClick={()=>window.print()} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-400"><Printer size={14}/></button>
                  <button onClick={()=>onToast('Share link copied (demo)')} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-400"><Share2 size={14}/></button>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{doc.body}</p>
              {doc.type==='Equipment Order Form' && doc.items && (
                <div className="border border-zinc-800 rounded-lg p-3 text-sm space-y-1">
                  {doc.items.map((it,i)=>(<div key={i} className="flex justify-between text-zinc-400"><span>{it.qty}× {it.name}</span><span className="font-mono">{fmtUSD(it.price*it.qty)}</span></div>))}
                  <div className="flex justify-between font-semibold text-zinc-100 pt-1 border-t border-zinc-800"><span>Total</span><span className="font-mono text-amber-400">{fmtUSD(doc.total)}</span></div>
                </div>
              )}
              {doc.type==='Service Agreement' && (
                <div className="space-y-3 border-t border-zinc-800 pt-4">
                  <div className="flex gap-2">
                    <button onClick={()=>setRole('agent')} className={`px-3 py-1.5 rounded-full text-xs ${role==='agent'?'bg-amber-500 text-zinc-950':'bg-zinc-800 text-zinc-400'}`}>Sign as agent</button>
                    <button onClick={()=>setRole('customer')} className={`px-3 py-1.5 rounded-full text-xs ${role==='customer'?'bg-amber-500 text-zinc-950':'bg-zinc-800 text-zinc-400'}`}>Sign as customer</button>
                  </div>
                  {(role==='agent' && doc.signatureAgent) || (role==='customer' && doc.signatureCustomer) ? (
                    <div className="space-y-2">
                      <img src={role==='agent'?doc.signatureAgent:doc.signatureCustomer} alt="signature" className="bg-zinc-950 rounded-lg border border-zinc-800 w-full max-w-xs"/>
                      <div className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={13}/> Signed</div>
                    </div>
                  ) : (
                    <SignaturePad key={role} onSave={(dataUrl)=>onUpdateDoc(prospect.id, doc.id, role, dataUrl)} />
                  )}
                  <div className="flex gap-3 text-xs text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">{doc.signatureAgent?<CheckCircle2 size={13} className="text-emerald-400"/>:<Circle size={13}/>} Agent</span>
                    <span className="flex items-center gap-1">{doc.signatureCustomer?<CheckCircle2 size={13} className="text-emerald-400"/>:<Circle size={13}/>} Customer</span>
                  </div>
                </div>
              )}
            </div>
          ) : <p className="text-sm text-zinc-500">No documents yet.</p>}
        </Card>
      </div>
    </div>
  );
}

/* ============== PROPOSAL EXPORT + QR CODE ============== */
// Minimal SVG QR code renderer (encodes URL into a visual grid — decorative/symbolic; real production should use a full QR library)
function buildQrMatrix(text){
  // generate a stable 21×21 deterministic grid seeded from text
  const size=21; const matrix=[];
  for(let r=0;r<size;r++){
    matrix.push([]);
    for(let c=0;c<size;c++){
      const seed = strHash(`${text}_${r}_${c}`);
      // keep finder patterns (corners) always dark for recognisability
      const inFinder = (r<7&&c<7)||(r<7&&c>13)||(r>13&&c<7);
      matrix[r].push(inFinder ? true : Math.abs(seed)%3===0);
    }
  }
  return matrix;
}
function QrDisplay({ url, size=140 }){
  const matrix = useMemo(()=>buildQrMatrix(url),[url]);
  const cell = size/21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg bg-white p-1.5 flex-shrink-0">
      {matrix.map((row,r)=>row.map((on,c)=> on ? <rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill="#18181b"/> : null))}
    </svg>
  );
}

function ProposalExportView({ prospects, selectedId, setSelectedId, onToast }){
  const prospect = prospects.find(p=>p.id===selectedId);
  const [escalation] = useState(3.5);

  if(!prospect){
    return (
      <div className="space-y-3">
        <Eyebrow>Proposal export & QR portfolio</Eyebrow>
        <Card>
          <p className="text-sm text-zinc-500 mb-3">Select a prospect to generate their printable proposal and shareable QR code.</p>
          <div className="space-y-2">
            {prospects.map(p=>(
              <button key={p.id} onClick={()=>setSelectedId(p.id)} className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 flex justify-between">
                <span>{p.name}</span><span className="text-zinc-500">{p.city}, {p.state}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const calc = prospect.calc;
  const srec = prospect.srec;
  const proj = buildProjection(calc, srec, escalation);
  const env = calcEnvImpact(calc);
  const portalUrl = `https://solarvault.app/portal/${prospect.id}`;

  function printProposal(){
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<title>Solar Proposal — ${prospect.name}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',sans-serif;color:#18181b;background:#fff;padding:40px;max-width:760px;margin:0 auto;}
  h1{font-size:28px;font-weight:800;color:#111;margin-bottom:4px;}
  .subtitle{color:#71717a;font-size:14px;margin-bottom:28px;}
  .section{margin-bottom:24px;}
  .section-title{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#f59e0b;font-weight:700;margin-bottom:10px;border-bottom:1px solid #e4e4e7;padding-bottom:6px;}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:4px;}
  .stat{background:#f9fafb;border-radius:10px;padding:12px 14px;}
  .stat-label{font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:.05em;}
  .stat-value{font-size:20px;font-weight:700;color:#111;margin-top:2px;}
  .stat-sub{font-size:11px;color:#a1a1aa;margin-top:2px;}
  .env-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
  .env-card{text-align:center;padding:14px 8px;background:#f0fdf4;border-radius:10px;}
  .env-card .icon{font-size:22px;margin-bottom:4px;}
  .env-card .value{font-size:18px;font-weight:700;color:#15803d;}
  .env-card .label{font-size:10px;color:#4b5563;}
  .table{width:100%;border-collapse:collapse;font-size:12px;}
  .table th{text-align:left;padding:8px 6px;border-bottom:2px solid #e4e4e7;color:#71717a;font-weight:600;}
  .table td{padding:8px 6px;border-bottom:1px solid #f4f4f5;}
  .badge{display:inline-block;padding:3px 9px;border-radius:999px;font-size:10px;font-weight:600;}
  .badge-gold{background:#fef9c3;color:#854d0e;}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e4e4e7;font-size:11px;color:#a1a1aa;text-align:center;}
  @media print{body{padding:20px;}.no-print{display:none;}}
</style></head><body>
<h1>${prospect.name}</h1>
<div class="subtitle">${prospect.address}, ${prospect.city}, ${prospect.state} &nbsp;·&nbsp; Prepared by SolarVault Agent Console &nbsp;·&nbsp; ${new Date().toLocaleDateString()}</div>

<div class="section">
  <div class="section-title">System overview</div>
  <div class="grid">
    <div class="stat"><div class="stat-label">System size</div><div class="stat-value">${fmtNum(calc.systemKw,2)} kW</div></div>
    <div class="stat"><div class="stat-label">Net cost (after 30% ITC)</div><div class="stat-value">${fmtUSD(calc.net)}</div><div class="stat-sub">Gross ${fmtUSD(calc.gross)}</div></div>
    <div class="stat"><div class="stat-label">Monthly benefit</div><div class="stat-value">${fmtUSD(calc.totalMonthly+(srec?srec.monthly:0))}</div><div class="stat-sub">${srec?'incl. SREC':'offset + buyback'}</div></div>
    <div class="stat"><div class="stat-label">Est. payback</div><div class="stat-value">${fmtNum(calc.paybackYears)} yrs</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">25-year financial summary (3.5% utility escalation)</div>
  <div class="grid">
    <div class="stat"><div class="stat-label">Year 5 net</div><div class="stat-value">${fmtUSD(proj[5]?.value)}</div></div>
    <div class="stat"><div class="stat-label">Year 10 net</div><div class="stat-value">${fmtUSD(proj[10]?.value)}</div></div>
    <div class="stat"><div class="stat-label">Year 15 net</div><div class="stat-value">${fmtUSD(proj[15]?.value)}</div></div>
    <div class="stat"><div class="stat-label">Year 25 net</div><div class="stat-value">${fmtUSD(proj[25]?.value)}</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">Environmental impact</div>
  <div class="env-grid">
    <div class="env-card"><div class="icon">🌿</div><div class="value">${fmtNum(env.annualCo2Kg/1000,1)}t</div><div class="label">CO₂ offset/yr</div></div>
    <div class="env-card"><div class="icon">🌳</div><div class="value">${Math.round(env.treesEq)}</div><div class="label">trees/yr equiv.</div></div>
    <div class="env-card"><div class="icon">🚗</div><div class="value">${fmtNum(env.carsEq,1)}</div><div class="label">cars off road/yr</div></div>
    <div class="env-card"><div class="icon">⚡</div><div class="value">${fmtNum(env.lifetime25Co2Tons,0)}t</div><div class="label">CO₂ lifetime (25yr)</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">Roof & installation</div>
  <table class="table">
    <tr><th>Dimension</th><th>Value</th></tr>
    <tr><td>Roof width × depth</td><td>${prospect.roof.widthFt} × ${prospect.roof.depthFt} ft</td></tr>
    <tr><td>Pitch</td><td>${prospect.roof.pitchDeg}°</td></tr>
    <tr><td>Orientation (azimuth)</td><td>${prospect.roof.azimuthDeg}°</td></tr>
    <tr><td>Shading</td><td>${prospect.roof.shadingPct}%</td></tr>
    <tr><td>Net metering</td><td>${NM_LABEL[prospect.calc.netMetering||'partial']||'Partial'}</td></tr>
  </table>
</div>

<div class="footer">Estimates are illustrative and based on regional solar-resource data, simplified derate factors, and net-metering policy assumptions. A detailed site assessment and utility review should precede any final proposal. SolarVault Agent Console.</div>
</body></html>`;
    const w = window.open('','_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(()=>w.print(), 400);
  }

  return (
    <div className="space-y-5">
      <button onClick={()=>setSelectedId(null)} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All prospects</button>
      <Eyebrow>Proposal export & QR portfolio — {prospect.name}</Eyebrow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Eyebrow>Printable proposal</Eyebrow>
          <p className="text-sm text-zinc-400 mb-4">Generates a clean, print-ready HTML proposal with system specs, 25-year financials, and environmental impact — formatted for a customer to review, sign, or share with a spouse.</p>
          <div className="space-y-2 text-xs text-zinc-500 mb-4">
            {[`${fmtNum(calc.systemKw,2)} kW system · ${fmtUSD(calc.net)} net cost`,'25-yr projection with 3.5% utility escalation','Environmental impact (CO₂, trees, cars)','Roof specs & net-metering policy','Legal disclaimer footer'].map(l=>(
              <div key={l} className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0"/>{l}</div>
            ))}
          </div>
          <Btn icon={FileDown} onClick={printProposal}>Export / print proposal</Btn>
          <p className="text-[11px] text-zinc-600 mt-2">Opens a print dialog. Save as PDF via your browser's print settings.</p>
        </Card>

        <Card>
          <Eyebrow>Shareable QR code — customer portal</Eyebrow>
          <p className="text-sm text-zinc-400 mb-4">Customer scans this to open their self-service portal — no login, no app. Their numbers, their project, their timeline.</p>
          <div className="flex items-center gap-4">
            <QrDisplay url={portalUrl} size={130}/>
            <div className="space-y-2 text-xs text-zinc-500">
              <div className="font-mono text-zinc-400 break-all">{portalUrl}</div>
              <Btn variant="outline" icon={Share2} onClick={()=>{ navigator.clipboard?.writeText(portalUrl).catch(()=>{}); onToast('Portal link copied to clipboard'); }}>Copy link</Btn>
              <div className="text-[11px] text-zinc-600">Print alongside the proposal — paste it or embed the QR so the customer can pull up their data any time.</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Eyebrow>Proposal preview — key figures</Eyebrow>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBlock icon={Zap} label="System size" value={`${fmtNum(calc.systemKw,2)} kW`}/>
          <StatBlock icon={DollarSign} label="Net cost (after ITC)" value={fmtUSD(calc.net)}/>
          <StatBlock icon={TrendingUp} label="Monthly benefit" value={fmtUSD(calc.totalMonthly+(srec?srec.monthly:0))}/>
          <StatBlock icon={Clock} label="25-yr net position" value={fmtUSD(proj[25]?.value)}/>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-center">
          {[{icon:'🌿',val:`${fmtNum(env.annualCo2Kg/1000,1)}t CO₂`,label:'offset/yr'},{icon:'🌳',val:`${Math.round(env.treesEq)} trees`,label:'equiv./yr'},{icon:'🚗',val:`${fmtNum(env.carsEq,1)} cars`,label:'off road/yr'},{icon:'⚡',val:`${fmtNum(env.lifetime25Co2Tons,0)}t CO₂`,label:'25yr lifetime'}].map(e=>(
            <div key={e.label} className="bg-zinc-800 rounded-xl p-3">
              <div className="text-xl mb-1">{e.icon}</div>
              <div className="font-mono text-sm text-emerald-400">{e.val}</div>
              <div className="text-[10px] text-zinc-500">{e.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============== UTILITY BILL ANALYZER ============== */
function BillAnalyzerView({ setProspectPrefill, setView, onToast }){
  const [imageData, setImageData] = useState(null);
  const [mediaType, setMediaType] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  function handleFile(file){
    if(!file) return;
    setResult(null); setError('');
    const reader = new FileReader();
    reader.onload = e => {
      const base64 = e.target.result.split(',')[1];
      setImageData(base64);
      setMediaType(file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  }

  async function analyze(){
    if(!imageData){ setError('Please upload a bill photo first.'); return; }
    setLoading(true); setError(''); setResult(null);
    try{
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-6', max_tokens:1000,
          messages:[{ role:'user', content:[
            { type:'image', source:{ type:'base64', media_type:mediaType, data:imageData }},
            { type:'text', text:'Extract data from this utility bill. Return ONLY a valid JSON object with no extra text, markdown, or backticks. Use this exact shape: {"utilityName":"","billingPeriod":"","totalAmountDollars":0,"kwhUsed":0,"ratePerKwh":0,"accountNumber":"","notes":""}. If a field cannot be determined set it to null. Do not include any text outside the JSON.' }
          ]}]
        })
      });
      const data = await res.json();
      const raw = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('').trim().replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(raw);
      setResult(parsed);
    }catch(e){
      setError('Could not extract bill data. Make sure the image is clear and shows the bill amount and usage. Try again or enter values manually.');
    }
    setLoading(false);
  }

  function useData(){
    if(!result) return;
    setProspectPrefill({
      billMonthly: result.totalAmountDollars || 150,
      notes: `Utility: ${result.utilityName||'unknown'} | Period: ${result.billingPeriod||''} | ${result.kwhUsed||'?'} kWh used | $${result.ratePerKwh||'?'}/kWh`,
    });
    setView('onboarding');
    onToast('Bill data pre-filled into onboarding form');
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <Eyebrow>Utility bill photo analyzer</Eyebrow>
      <Card>
        <p className="text-sm text-zinc-400 mb-4">Upload a photo of the customer's utility bill. Claude reads it and extracts usage, rate, and billing info — one click to pre-fill the onboarding form.</p>
        <div
          className="border-2 border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl p-8 text-center cursor-pointer transition"
          onClick={()=>fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{ e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        >
          <Camera size={32} className="mx-auto mb-2 text-zinc-600"/>
          <div className="text-sm text-zinc-400">Click or drag a bill photo here</div>
          <div className="text-xs text-zinc-600 mt-1">JPG, PNG, or PDF screenshot — make sure usage and amount are visible</div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>handleFile(e.target.files[0])}/>
        </div>
        {imageData && (
          <div className="mt-3 flex items-center gap-3">
            <img src={`data:${mediaType};base64,${imageData}`} alt="bill" className="w-24 h-24 object-cover rounded-lg border border-zinc-700"/>
            <div className="text-xs text-zinc-400">Bill image loaded. Ready to analyze.</div>
          </div>
        )}
        <Btn icon={Camera} className="mt-3" onClick={analyze} disabled={!imageData||loading}>{loading?'Reading bill…':'Analyze bill'}</Btn>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </Card>

      {result && (
        <Card className="border-amber-500/30">
          <Eyebrow>Extracted bill data</Eyebrow>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              ['Utility', result.utilityName],
              ['Billing period', result.billingPeriod],
              ['Monthly bill', result.totalAmountDollars!=null ? fmtUSD(result.totalAmountDollars) : null],
              ['Usage', result.kwhUsed!=null ? `${result.kwhUsed} kWh` : null],
              ['Rate', result.ratePerKwh!=null ? `$${Number(result.ratePerKwh).toFixed(4)}/kWh` : null],
              ['Account', result.accountNumber],
            ].map(([label,val])=>(
              <div key={label} className="bg-zinc-800 rounded-lg px-3 py-2">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wide">{label}</div>
                <div className="text-sm font-medium text-zinc-100 mt-0.5">{val||'—'}</div>
              </div>
            ))}
          </div>
          {result.notes && <p className="text-xs text-zinc-500 mb-3">{result.notes}</p>}
          <Btn icon={UserPlus} onClick={useData}>Use this data — start onboarding</Btn>
          <p className="text-[11px] text-zinc-600 mt-2">Always verify extracted values against the actual bill before presenting to a customer.</p>
        </Card>
      )}
    </div>
  );
}

/* ============== REFERRAL ENGINE + IMPACT CERTIFICATE ============== */
function buildReferralCode(prospectId){ return 'SVR-'+(Math.abs(strHash(prospectId+'ref'))%90000+10000).toString(); }

function ImpactCertificate({ prospect }){
  const env = calcEnvImpact(prospect.calc);
  const years = Math.max(1, Math.round((Date.now()-prospect.createdAt)/(365.25*24*60*60*1000)));
  return (
    <div id="impact-cert" style={{ background:'linear-gradient(135deg,#18181b 0%,#1c1917 100%)', border:'1px solid #fbbf2440', borderRadius:16, padding:28, maxWidth:480, fontFamily:'sans-serif' }}>
      <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.12em', color:'#fbbf24', fontWeight:700, marginBottom:6 }}>SolarVault · Impact Certificate</div>
      <div style={{ fontSize:22, fontWeight:800, color:'#fafafa', marginBottom:2 }}>{prospect.name}</div>
      <div style={{ fontSize:12, color:'#71717a', marginBottom:20 }}>{prospect.address}, {prospect.city}, {prospect.state}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        {[
          { icon:'🌿', val:`${fmtNum(env.annualCo2Kg/1000,1)}t`, label:'CO\u2082 offset / year' },
          { icon:'🌳', val:`${Math.round(env.treesEq)}`, label:'trees equivalent / yr' },
          { icon:'🚗', val:`${fmtNum(env.carsEq,1)}`, label:'cars off the road / yr' },
          { icon:'⚡', val:`${Math.round(env.annualKwh).toLocaleString()} kWh`, label:'clean energy / year' },
        ].map(e=>(
          <div key={e.label} style={{ background:'#27272a', borderRadius:10, padding:'12px 14px', textAlign:'center' }}>
            <div style={{ fontSize:22 }}>{e.icon}</div>
            <div style={{ fontSize:20, fontWeight:700, color:'#34d399', marginTop:2 }}>{e.val}</div>
            <div style={{ fontSize:10, color:'#71717a', marginTop:2 }}>{e.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#27272a', borderRadius:10, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize:11, color:'#a1a1aa' }}>System · {fmtNum(prospect.calc.systemKw,2)} kW &nbsp;|&nbsp; Active {years} yr{years!==1?'s':''}</div>
        <div style={{ fontSize:11, color:'#fbbf24', fontWeight:600 }}>EST. {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}

function ReferralView({ prospects, selectedId, setSelectedId, onToast }){
  const liveProspects = prospects.filter(p=>p.stage==='Active (PTO)');
  const otherProspects = prospects.filter(p=>p.stage!=='Active (PTO)');
  const prospect = prospects.find(p=>p.id===selectedId);

  if(!prospect){
    return (
      <div className="space-y-4">
        <Eyebrow>Referral engine + impact certificates</Eyebrow>
        {liveProspects.length===0 && (
          <Card><p className="text-sm text-zinc-500">No prospects at Active (PTO) stage yet. Referral certificates generate once a system is live. Advance a prospect to <span className="text-amber-400">Active (PTO)</span> in the Pipeline tab to unlock.</p></Card>
        )}
        {liveProspects.length>0 && (
          <div className="space-y-2">
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Live — eligible for referral</div>
            {liveProspects.map(p=>(
              <button key={p.id} onClick={()=>setSelectedId(p.id)} className="w-full text-left">
                <Card className="hover:border-amber-500/50 transition flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-100">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.city}, {p.state} · {fmtNum(p.calc.systemKw,2)} kW</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-900 text-emerald-300">Active (PTO)</span>
                </Card>
              </button>
            ))}
          </div>
        )}
        {otherProspects.length>0 && (
          <div className="space-y-2">
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Not yet live</div>
            {otherProspects.map(p=>(
              <Card key={p.id} className="flex items-center justify-between opacity-50">
                <div>
                  <div className="font-medium text-zinc-300">{p.name}</div>
                  <div className="text-xs text-zinc-500">{p.stage}</div>
                </div>
                <span className="text-xs text-zinc-600">Awaiting PTO</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  const code = buildReferralCode(prospect.id);
  const referralUrl = `https://solarvault.app/referral/${code}`;
  const env = calcEnvImpact(prospect.calc);

  return (
    <div className="space-y-5">
      <button onClick={()=>setSelectedId(null)} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All prospects</button>
      <Eyebrow>{prospect.name} — referral & impact</Eyebrow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Eyebrow>Referral link</Eyebrow>
          <p className="text-sm text-zinc-400 mb-3">Share this link with the customer — when someone they refer signs a contract, both get a credit.</p>
          <div className="bg-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-amber-400 break-all mb-3">{referralUrl}</div>
          <div className="text-sm font-semibold text-zinc-200 mb-1">Code: <span className="font-mono text-amber-400">{code}</span></div>
          <div className="flex gap-2 mt-3">
            <Btn variant="outline" icon={Share2} onClick={()=>{ navigator.clipboard?.writeText(referralUrl).catch(()=>{}); onToast('Referral link copied'); }}>Copy link</Btn>
            <Btn variant="ghost" icon={Send} onClick={()=>onToast(`Referral message sent to ${prospect.email||prospect.name} (demo)`)}>Send to customer</Btn>
          </div>
        </Card>
        <Card>
          <Eyebrow>Impact summary</Eyebrow>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon:'🌿', val:`${fmtNum(env.annualCo2Kg/1000,1)}t`, label:'CO\u2082/yr' },
              { icon:'🌳', val:Math.round(env.treesEq), label:'trees/yr' },
              { icon:'🚗', val:fmtNum(env.carsEq,1), label:'cars/yr' },
              { icon:'⚡', val:`${Math.round(env.annualKwh).toLocaleString()}`, label:'kWh/yr' },
            ].map(e=>(
              <div key={e.label} className="bg-zinc-800 rounded-lg p-2.5 text-center">
                <div className="text-lg">{e.icon}</div>
                <div className="font-mono text-base text-emerald-400">{e.val}</div>
                <div className="text-[10px] text-zinc-500">{e.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <Eyebrow>Impact certificate — preview</Eyebrow>
        <ImpactCertificate prospect={prospect}/>
        <div className="flex gap-2 mt-4">
          <Btn icon={Printer} onClick={()=>{
            const cert = document.getElementById('impact-cert');
            if(!cert) return;
            const w = window.open('','_blank');
            w.document.write(`<html><head><title>Impact Certificate — ${prospect.name}</title><style>body{margin:0;padding:24px;background:#18181b;}</style></head><body>${cert.outerHTML}</body></html>`);
            w.document.close(); w.focus(); setTimeout(()=>w.print(),300);
          }}>Print certificate</Btn>
          <Btn variant="outline" icon={Share2} onClick={()=>onToast('Certificate share link copied (demo)')}>Share certificate</Btn>
        </div>
        <p className="text-[11px] text-zinc-600 mt-2">Based on EPA eGRID US average. Share this with the customer — it makes a strong social post and drives organic referrals.</p>
      </Card>
    </div>
  );
}

/* ============== REBATE / INCENTIVE STACKING ============== */
function RebateStackView({ loc, setLoc }){
  const selState = STATES.find(s=>s.abbr===loc.stateAbbr) || STATES.find(s=>s.abbr==='NY');
  const selCity = selState.cities[loc.cityIdx ?? 0];
  const [batteryKwh, setBatteryKwh] = useState(0);
  const calc = useMemo(()=>estimateSolar(selCity),[selCity]);
  const stack = useMemo(()=>calcRebateStack(selState.abbr, calc.systemKw, calc.gross, batteryKwh),[selState.abbr, calc.systemKw, calc.gross, batteryKwh]);
  const srec = useMemo(()=>getSrec(selState.abbr, calc.monthlyProd),[selState.abbr, calc.monthlyProd]);
  const hasRebates = stack.rebates.length>0;
  const paybackWithStack = stack.netCost>0 && calc.totalMonthly>0 ? stack.netCost/(calc.totalMonthly*12) : 99;
  const standardPayback = calc.paybackYears;

  const waterfallData = [
    { name:'Gross cost', value:Math.round(calc.gross), fill:'#71717a' },
    { name:'30% ITC', value:-Math.round(stack.itc), fill:'#fbbf24' },
    ...stack.rebates.map(r=>({ name:r.name.length>18?r.name.slice(0,16)+'…':r.name, value:-Math.round(r.amount), fill:'#34d399' })),
    { name:'Net cost', value:Math.round(stack.netCost), fill:'#f59e0b' },
  ];

  return (
    <div className="space-y-5">
      <Eyebrow>Full incentive stack — beyond the 30% ITC</Eyebrow>
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Field label="State">
            <select className={inputCls} value={selState.abbr} onChange={e=>setLoc({ stateAbbr:e.target.value, cityIdx:0 })}>
              {STATES.map(s=><option key={s.abbr} value={s.abbr}>{s.name}{REBATE_DB[s.abbr]?' ✦':''}</option>)}
            </select>
          </Field>
          <Field label="City">
            <select className={inputCls} value={loc.cityIdx ?? 0} onChange={e=>setLoc({ ...loc, stateAbbr:selState.abbr, cityIdx:Number(e.target.value) })}>
              {selState.cities.map((c,i)=><option key={c.name} value={i}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Battery storage (kWh, if any)">
            <select className={inputCls} value={batteryKwh} onChange={e=>setBatteryKwh(Number(e.target.value))}>
              <option value={0}>No battery</option>
              <option value={5}>5 kWh (Enphase IQ Battery)</option>
              <option value={13.5}>13.5 kWh (Powerwall 3)</option>
              <option value={27}>27 kWh (2x Powerwall 3)</option>
            </select>
          </Field>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><StatBlock icon={DollarSign} label="Gross system cost" value={fmtUSD(calc.gross)} sub={`${fmtNum(calc.systemKw,2)} kW`}/></Card>
        <Card><StatBlock icon={Percent} label="Federal 30% ITC" value={fmtUSD(stack.itc)} sub="Applies to owned systems only"/></Card>
        <Card><StatBlock icon={TrendingUp} label="State + utility rebates" value={hasRebates?fmtUSD(stack.totalRebates):'None in this state'} sub={hasRebates?`${stack.rebates.length} program${stack.rebates.length>1?'s':''} found`:'Try NJ, MA, NY, CT, MD, CA'}/></Card>
        <Card><StatBlock icon={Zap} label="Net effective cost" value={fmtUSD(stack.netCost)} sub={`vs. ${fmtUSD(calc.net)} ITC-only`}/></Card>
      </div>

      {hasRebates && (
        <Card>
          <Eyebrow>Incentive waterfall — {selState.name}</Eyebrow>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} interval={0} angle={-10} textAnchor="end" height={48}/>
              <YAxis stroke="#71717a" fontSize={10} tickFormatter={v=>`$${Math.round(Math.abs(v)/1000)}k`}/>
              <Tooltip formatter={v=>[fmtUSD(Math.abs(v)), v<0?'Incentive / credit':'Cost']} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
              <Bar dataKey="value" radius={[6,6,0,0]}>{waterfallData.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card>
        <Eyebrow>Program details</Eyebrow>
        {!hasRebates ? (
          <div className="text-sm text-zinc-500 space-y-1">
            <p>{selState.name} does not currently have a state or major utility rebate in our database.</p>
            <p className="text-xs">The 30% federal ITC still applies to all 50 states for owner-financed systems. States marked ✦ in the dropdown have additional stacking incentives.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              <div className="bg-zinc-800 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-zinc-500">Standard payback</div>
                <div className="font-mono text-lg text-zinc-300">{fmtNum(standardPayback)} yrs</div>
                <div className="text-[10px] text-zinc-600">ITC only</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-zinc-400">Payback with full stack</div>
                <div className="font-mono text-lg text-amber-400">{fmtNum(paybackWithStack)} yrs</div>
                <div className="text-[10px] text-zinc-500">ITC + state + utility</div>
              </div>
              {srec && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-zinc-400">+ SREC income</div>
                  <div className="font-mono text-lg text-emerald-400">{fmtUSD(srec.monthly)}/mo</div>
                  <div className="text-[10px] text-zinc-500">{srec.program}</div>
                </div>
              )}
            </div>
            {stack.rebates.map(r=>(
              <div key={r.name} className="border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-zinc-100">{r.name}</span>
                    <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${r.level==='state'?'bg-blue-900 text-blue-300':'bg-purple-900 text-purple-300'}`}>{r.level}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold">{fmtUSD(r.amount)}</span>
                </div>
                <div className="text-xs text-zinc-500">Source: {r.source}</div>
                {r.note && <div className="text-[11px] text-zinc-600 mt-1 flex items-start gap-1"><Info size={11} className="mt-0.5 flex-shrink-0 text-amber-500/60"/>{r.note}</div>}
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-zinc-600 mt-4">Rebate amounts are illustrative — programs change frequently, have funding caps, and may require pre-application. Always verify current availability and amounts with the program administrator before quoting.</p>
      </Card>
    </div>
  );
}

/* ============== EV CHARGING INTEGRATION ============== */
function EVView({ loc, setLoc }){
  const selState = STATES.find(s=>s.abbr===loc.stateAbbr) || STATES.find(s=>s.abbr==='AZ');
  const selCity = selState.cities[loc.cityIdx ?? 0];
  const [hasEv, setHasEv] = useState(false);
  const [evs, setEvs] = useState([{ modelId:'modely', miles:12000 }]);
  const baseCalc = useMemo(()=>estimateSolar(selCity),[selCity]);
  const totalEvKwhMonthly = useMemo(()=>{
    if(!hasEv) return 0;
    return evs.reduce((s,ev)=>{
      const m = EV_MODELS.find(x=>x.id===ev.modelId)||EV_MODELS[0];
      return s+(ev.miles/12)*m.kwhPerMile;
    },0);
  },[hasEv,evs]);
  const adjData = useMemo(()=>({ ...selCity, bill: selCity.bill+totalEvKwhMonthly*selCity.rate }),[selCity,totalEvKwhMonthly]);
  const adjCalc = useMemo(()=>estimateSolar(adjData),[adjData]);
  const addKw = adjCalc.systemKw-baseCalc.systemKw;
  const addCost = Math.round(addKw*1000*3.1*0.70);
  function addEv(){ setEvs(e=>[...e,{ modelId:'modely', miles:10000 }]); }
  function removeEv(i){ setEvs(e=>e.filter((_,idx)=>idx!==i)); }
  function upEv(i,k,v){ setEvs(e=>e.map((x,idx)=>idx===i?{...x,[k]:v}:x)); }
  return (
    <div className="space-y-5">
      <Eyebrow>EV charging integration</Eyebrow>
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Field label="State"><select className={inputCls} value={selState.abbr} onChange={e=>setLoc({ stateAbbr:e.target.value, cityIdx:0 })}>{STATES.map(s=><option key={s.abbr} value={s.abbr}>{s.name}</option>)}</select></Field>
          <Field label="City"><select className={inputCls} value={loc.cityIdx??0} onChange={e=>setLoc({ ...loc, stateAbbr:selState.abbr, cityIdx:Number(e.target.value) })}>{selCity && selState.cities.map((c,i)=><option key={c.name} value={i}>{c.name}</option>)}</select></Field>
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm text-zinc-300 cursor-pointer">
          <input type="checkbox" checked={hasEv} onChange={e=>setHasEv(e.target.checked)} className="accent-amber-500"/>
          Customer has or is planning to get an electric vehicle
        </label>
      </Card>
      {hasEv && (
        <Card>
          <Eyebrow>EV fleet</Eyebrow>
          {evs.map((ev,i)=>(
            <div key={i} className="flex gap-2 items-end mb-3 flex-wrap">
              <Field label={`EV ${i+1}`}>
                <select className={inputCls} style={{ minWidth:220 }} value={ev.modelId} onChange={e=>upEv(i,'modelId',e.target.value)}>
                  {EV_MODELS.map(m=><option key={m.id} value={m.id}>{m.name} — {m.kwhPerMile} kWh/mi</option>)}
                </select>
              </Field>
              <Field label="Annual miles"><input type="number" className={inputCls} style={{ width:110 }} value={ev.miles} onChange={e=>upEv(i,'miles',Number(e.target.value))}/></Field>
              {evs.length>1 && <button onClick={()=>removeEv(i)} className="pb-2 text-zinc-600 hover:text-red-400"><Trash2 size={14}/></button>}
            </div>
          ))}
          <Btn variant="ghost" icon={Plus} onClick={addEv}>Add another EV</Btn>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Eyebrow>Base solar system</Eyebrow>
          <StatBlock icon={Zap} label="System size" value={`${fmtNum(baseCalc.systemKw,2)} kW`}/>
          <div className="h-px bg-zinc-800 my-3"/>
          <StatBlock icon={DollarSign} label="Monthly benefit" value={fmtUSD(baseCalc.totalMonthly)}/>
          <div className="h-px bg-zinc-800 my-3"/>
          <StatBlock icon={Clock} label="Payback" value={`${fmtNum(baseCalc.paybackYears)} yrs`}/>
        </Card>
        <Card className={hasEv?'border-amber-500/30':''}>
          <Eyebrow>EV-adjusted system</Eyebrow>
          {!hasEv ? <p className="text-sm text-zinc-500">Enable EV above to see adjusted sizing.</p> : (
            <>
              <StatBlock icon={Zap} label="System size" value={`${fmtNum(adjCalc.systemKw,2)} kW`} sub={`+${fmtNum(addKw,2)} kW for EV`}/>
              <div className="h-px bg-zinc-800 my-3"/>
              <StatBlock icon={DollarSign} label="Monthly benefit" value={fmtUSD(adjCalc.totalMonthly)} sub="Includes EV fuel offset"/>
              <div className="h-px bg-zinc-800 my-3"/>
              <StatBlock icon={Clock} label="Payback" value={`${fmtNum(adjCalc.paybackYears)} yrs`}/>
            </>
          )}
        </Card>
      </div>
      {hasEv && totalEvKwhMonthly>0 && (
        <Card>
          <Eyebrow>Upsell summary</Eyebrow>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatBlock icon={Car} label="Monthly EV load" value={`${Math.round(totalEvKwhMonthly)} kWh`}/>
            <StatBlock icon={DollarSign} label="Current EV charging cost" value={fmtUSD(totalEvKwhMonthly*selCity.rate)} sub="at grid rate"/>
            <StatBlock label="Additional panels" value={`~${Math.round(addKw*1000/430)}`} sub="at 430W each"/>
            <StatBlock icon={DollarSign} label="Add-on net cost (after ITC)" value={fmtUSD(addCost)}/>
          </div>
          <div className="flex items-start gap-2 bg-zinc-800 rounded-lg px-3 py-2.5">
            <Info size={13} className="text-amber-400 mt-0.5 flex-shrink-0"/>
            <p className="text-xs text-zinc-400">Agent talking point: With the EV-sized system, this customer charges their vehicle on clean solar — eliminating {fmtUSD(totalEvKwhMonthly*selCity.rate)}/month in charging costs on top of the utility offset. The additional {fmtNum(addKw,2)} kW adds only {fmtUSD(addCost)} to net cost after the 30% ITC — the best incremental cost per kW in the proposal.</p>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============== AI PROPOSAL NARRATIVE ============== */
const buildNarrativePrompt = (p, calc, srec, env, proj, rebateStack) => {
  const rebateTotal = rebateStack ? rebateStack.totalRebates : 0;
  const netWithRebates = rebateStack ? fmtUSD(rebateStack.netCost) : fmtUSD(calc.net);
  const srecLine = srec ? `SREC income: ${fmtUSD(srec.monthly)}/month through ${srec.program}.` : '';
  const rebateLine = rebateTotal>0 ? `Additional state/utility rebates: ${fmtUSD(rebateTotal)} stacked on top of ITC; net after all incentives: ${netWithRebates}.` : '';
  return `Generate a personalized solar proposal narrative for a homeowner. Write exactly 3 short paragraphs totaling around 200 words. Flowing prose only — no headers, no bullet points, no markdown. Warm, professional, honest tone. Never make guarantees about future utility rates or specific return numbers.

Customer: ${p.name}, ${p.address}, ${p.city}, ${p.state}
System size: ${fmtNum(calc.systemKw,2)} kW
Financials: ${fmtUSD(calc.totalMonthly)}/month estimated benefit · ${fmtNum(calc.paybackYears)}-year payback · ${fmtUSD(proj[25]?.value||0)} 25-year net position (3.5% utility rate escalation)
30% federal ITC: ${fmtUSD(calc.itc)} in tax credits
${rebateLine}
${srecLine}
Environmental: ${fmtNum(env.annualCo2Kg/1000,1)} metric tons CO2 offset per year · equivalent to ${Math.round(env.treesEq)} trees planted annually
Roof: ${p.roof.widthFt}x${p.roof.depthFt} ft · ${p.roof.pitchDeg} degree pitch · ${p.roof.azimuthDeg} degree orientation

Paragraph 1: Why their specific property and location is a strong solar candidate. Reference ${p.city} or ${p.state} naturally. Mention the sun resource.
Paragraph 2: The financial case — monthly benefit, payback period, 25-year net position. Mention the 30% ITC. Include SREC or rebate income if applicable. Be honest — say estimated, not guaranteed.
Paragraph 3: Environmental impact and energy independence. Keep it genuine and grounded — no hype.`;
};

function NarrativeView({ prospects, selectedId, setSelectedId, onToast }){
  const [narrative, setNarrative] = useState('');
  const [loading, setLoading] = useState(false);
  const prospect = prospects.find(p=>p.id===selectedId);
  async function generate(){
    if(!prospect) return;
    setLoading(true); setNarrative('');
    const stMatch = STATES.find(s=>s.name.toLowerCase()===prospect.state.toLowerCase());
    const srec = prospect.srec;
    const env = calcEnvImpact(prospect.calc);
    const proj = buildProjection(prospect.calc, srec, 3.5);
    const rebateStack = stMatch ? calcRebateStack(stMatch.abbr, prospect.calc.systemKw, prospect.calc.gross) : null;
    try{
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:1000,
          messages:[{ role:'user', content: buildNarrativePrompt(prospect, prospect.calc, srec, env, proj, rebateStack) }]
        })
      });
      const data = await res.json();
      setNarrative((data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('').trim());
    }catch(e){ setNarrative('Could not generate narrative — please try again.'); }
    setLoading(false);
  }
  if(!prospect) return (
    <div className="space-y-3">
      <Eyebrow>AI proposal narrative generator</Eyebrow>
      <Card>
        <p className="text-sm text-zinc-500 mb-3">Select a prospect to generate a personalized proposal narrative using their actual system data, incentives, and environmental impact.</p>
        <div className="space-y-2">
          {prospects.map(p=>(
            <button key={p.id} onClick={()=>setSelectedId(p.id)} className="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 flex justify-between">
              <span>{p.name}</span><span className="text-zinc-500">{p.city}, {p.state}</span>
            </button>
          ))}
          {prospects.length===0 && <p className="text-sm text-zinc-500">No prospects yet — create one in New Prospect first.</p>}
        </div>
      </Card>
    </div>
  );
  return (
    <div className="space-y-5">
      <button onClick={()=>{ setSelectedId(null); setNarrative(''); }} className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1"><ArrowLeft size={13}/> All prospects</button>
      <Eyebrow>AI proposal narrative — {prospect.name}</Eyebrow>
      <Card>
        <p className="text-sm text-zinc-400 mb-3">Claude writes a personalized 3-paragraph narrative using this prospect's actual data — not a mail-merge template.</p>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-500 mb-4">
          {[`${fmtNum(prospect.calc.systemKw,2)} kW`,`${fmtUSD(prospect.calc.totalMonthly)}/mo`,`${fmtNum(prospect.calc.paybackYears)} yr payback`,prospect.srec?`${prospect.srec.program} SREC`:`${prospect.state} market`].map(t=>(
            <span key={t} className="bg-zinc-800 px-2 py-1 rounded">{t}</span>
          ))}
        </div>
        <Btn icon={Sparkles} onClick={generate} disabled={loading}>{loading?'Writing…':'Generate narrative'}</Btn>
      </Card>
      {narrative && (
        <Card className="border-amber-500/20">
          <Eyebrow>Generated narrative</Eyebrow>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-4">{narrative}</p>
          <div className="flex gap-2">
            <Btn variant="outline" icon={Save} onClick={()=>{ navigator.clipboard?.writeText(narrative).catch(()=>{}); onToast('Narrative copied to clipboard'); }}>Copy</Btn>
            <Btn variant="ghost" icon={RotateCcw} onClick={generate} disabled={loading}>Regenerate</Btn>
          </div>
          <p className="text-[11px] text-zinc-600 mt-3">Review all figures before sending — AI-generated text should be verified against the final proposal numbers.</p>
        </Card>
      )}
    </div>
  );
}

/* ============== LENDER MARKETPLACE ============== */
function LenderView(){
  const [loanAmt, setLoanAmt] = useState(28000);
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-5">
      <Eyebrow>Solar lender marketplace</Eyebrow>
      <Card>
        <Field label="Gross system cost (what is being financed — before ITC)">
          <input type="number" className={inputCls} value={loanAmt} onChange={e=>setLoanAmt(Number(e.target.value))} placeholder="28000"/>
        </Field>
        <p className="text-[11px] text-zinc-600 mt-1.5">Lenders finance the full gross cost. The customer applies their 30% ITC refund to pay down principal in year 1, reducing the effective balance. Monthly payment shown is the initial obligation before that paydown.</p>
      </Card>
      <div className="space-y-3">
        {LENDERS.map(lender=>(
          <Card key={lender.id} className={`transition ${open===lender.id?'border-amber-500/50':''}`}>
            <button className="w-full text-left" onClick={()=>setOpen(open===lender.id?null:lender.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-100 flex items-center gap-2"><Banknote size={15} className="text-amber-400"/>{lender.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Min score {lender.minScore} · {lender.approval} approval · {lender.website}</div>
                </div>
                <div className="text-xs text-zinc-500">{open===lender.id?'▲ Close':'▼ Products'}</div>
              </div>
            </button>
            {open===lender.id && (
              <div className="mt-4 border-t border-zinc-800 pt-4 space-y-3">
                <p className="text-xs text-zinc-500">{lender.note}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800">
                        {['Product','APR','Term','Mo. payment','Dealer fee'].map(h=>(
                          <th key={h} className="text-left pb-2 pr-3 font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lender.products.map(prod=>{
                        const pmt = Math.round(calcLoanPayment(loanAmt, prod.apr/100, prod.term));
                        return (
                          <tr key={prod.name} className="border-b border-zinc-800/40">
                            <td className="py-2 pr-3">
                              <span className="text-zinc-200">{prod.name}</span>
                              {prod.popular && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Popular</span>}
                              {prod.note && <div className="text-[10px] text-zinc-600 mt-0.5">{prod.note}</div>}
                            </td>
                            <td className="py-2 pr-3 font-mono text-zinc-300">{prod.apr}%</td>
                            <td className="py-2 pr-3 font-mono text-zinc-300">{prod.term} yr</td>
                            <td className="py-2 pr-3 font-mono text-amber-400 font-semibold">${pmt}/mo</td>
                            <td className="py-2 font-mono text-zinc-400">{prod.dealerFee}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-start gap-2 bg-zinc-800 rounded-lg px-3 py-2.5">
                  <Info size={12} className="text-amber-400 mt-0.5 flex-shrink-0"/>
                  <p className="text-[11px] text-zinc-400">Dealer fee transparency: a {lender.products[0].dealerFee}% dealer fee on a {fmtUSD(loanAmt)} loan means the lender pays the installer {fmtUSD(Math.round(loanAmt*(1-lender.products[0].dealerFee/100)))} — the fee is typically built into the contract price, which is why a cash price and a loan price for the same system often differ. A zero-dealer-fee product has a higher APR instead.</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600">Rates, dealer fees, and product availability change frequently. All figures are illustrative — verify current products and your agency approval status with each lender before quoting.</p>
    </div>
  );
}

/* ============== HOA SOLAR RIGHTS MAP ============== */
function HOARightsView({ loc, setLoc }){
  const selState = STATES.find(s=>s.abbr===loc.stateAbbr) || STATES.find(s=>s.abbr==='CA');
  const detail = HOA_SOLAR_RIGHTS[selState.abbr];
  const counts = useMemo(()=>({
    full: Object.values(HOA_SOLAR_RIGHTS).filter(s=>s.level==='full').length,
    partial: Object.values(HOA_SOLAR_RIGHTS).filter(s=>s.level==='partial').length,
    none: Object.values(HOA_SOLAR_RIGHTS).filter(s=>s.level==='none').length,
  }),[]);
  return (
    <div className="space-y-5">
      <Eyebrow>HOA solar rights — all 50 states</Eyebrow>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(HOA_LEVEL_LABEL).map(([lvl,label])=>(
          <Card key={lvl} className="text-center">
            <div className="text-2xl font-mono font-bold mb-1" style={{ color:HOA_LEVEL_COLOR[lvl] }}>{counts[lvl]}</div>
            <div className="text-xs font-semibold text-zinc-300">{label}</div>
            <div className="text-[10px] text-zinc-600 mt-0.5">{lvl==='full'?'HOA cannot prohibit':lvl==='partial'?'Can restrict, not ban':'HOA has full authority'}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Eyebrow>Select a state</Eyebrow>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {STATES.map(s=>{
            const r = HOA_SOLAR_RIGHTS[s.abbr];
            const lvl = r?.level||'none';
            const isSelected = selState.abbr===s.abbr;
            return (
              <button key={s.abbr} onClick={()=>setLoc({ ...loc, stateAbbr:s.abbr })}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${isSelected?'ring-2 ring-white/40':''}`}
                style={{ background:HOA_LEVEL_COLOR[lvl]+'22', color:HOA_LEVEL_COLOR[lvl], border:`1px solid ${HOA_LEVEL_COLOR[lvl]}44` }}>
                {s.abbr}
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 text-[11px] text-zinc-500">
          {Object.entries(HOA_LEVEL_COLOR).map(([lvl,col])=>(
            <span key={lvl} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background:col }}/>
              {HOA_LEVEL_LABEL[lvl]}
            </span>
          ))}
        </div>
      </Card>
      {detail && (
        <Card style={{ borderColor: HOA_LEVEL_COLOR[detail.level]+'44' }}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Eyebrow>{selState.name}</Eyebrow>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold mb-2" style={{ background:HOA_LEVEL_COLOR[detail.level]+'22', color:HOA_LEVEL_COLOR[detail.level] }}>{HOA_LEVEL_LABEL[detail.level]}</span>
            {detail.statute && <span className="text-xs font-mono text-zinc-500 mb-2">{detail.statute}</span>}
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">{detail.summary}</p>
          <div className="bg-zinc-800 rounded-lg px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wide text-amber-500/80 font-semibold mb-1 flex items-center gap-1"><Shield size={11}/> Agent talking point</div>
            {detail.level==='full' && detail.statute && (
              <p className="text-xs text-zinc-400">{`Under ${detail.statute}, any HOA rule prohibiting or unreasonably restricting your solar installation is legally void in ${selState.name}. A written denial from the HOA does not hold up — you have a right to install.`}</p>
            )}
            {detail.level==='partial' && detail.statute && (
              <p className="text-xs text-zinc-400">{`${selState.name} law limits HOA authority under ${detail.statute} — they cannot outright ban solar, only impose reasonable conditions. A flat denial is legally challengeable.`}</p>
            )}
            {detail.level==='none' && (
              <p className="text-xs text-zinc-400">{`${selState.name} has no preemption statute. The HOA governing documents (CC&Rs) control. Submit a proactive architectural request with a professional presentation before they issue a formal denial — it is harder to reverse a denial than to win an initial approval.`}</p>
            )}
          </div>
          <p className="text-[11px] text-zinc-600 mt-3">Statutes change and application varies by jurisdiction — always verify current law and consult a licensed attorney before citing this in a formal dispute. This is informational, not legal advice.</p>
        </Card>
      )}
    </div>
  );
}

/* ============== STORM-AWARE OUTREACH ============== */
function StormOutreachView({ prospects, onToast }){
  const [stateAbbr, setStateAbbr] = useState('FL');
  const [severity, setSeverity] = useState('moderate');
  const riskHours = getOutageHours(stateAbbr);
  const stateProspects = prospects.filter(p=>{
    const st = STATES.find(s=>s.name.toLowerCase()===p.state.toLowerCase());
    return st && st.abbr===stateAbbr;
  });
  const batteryProspects = stateProspects.filter(p=>p.plansBattery || p.equipmentOrders?.some(o=>o.items?.some(i=>i.cat==='Battery')));
  const pipelineProspects = stateProspects.filter(p=>!['Installed','Active (PTO)'].includes(p.stage));
  const liveProspects = stateProspects.filter(p=>p.stage==='Active (PTO)');
  const batteryMsg = (p)=>`Hi ${p.name.split(' ')[0]}, heads up — a storm is forecast for your area. If your battery system is installed, make sure it is set to charge to 100% before the storm hits so you have full backup capacity ready. Stay safe.`;
  const pipelineMsg = (p)=>`Hi ${p.name.split(' ')[0]}, as ${p.city||p.state} prepares for an incoming storm, this is a reminder that homeowners with solar + battery backup in your neighborhood may keep power through the outage. When you are ready to move forward, your system would have you covered. Happy to reconnect anytime.`;
  return (
    <div className="space-y-5">
      <Eyebrow>Storm-aware outreach trigger</Eyebrow>
      <Card>
        <p className="text-sm text-zinc-400 mb-4">When a storm is forecast for your service area, surface the right message for each prospect type automatically — battery owners get a charge reminder, hot pipeline leads get a timely follow-up.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Affected state">
            <select className={inputCls} value={stateAbbr} onChange={e=>setStateAbbr(e.target.value)}>
              {STATES.map(s=><option key={s.abbr} value={s.abbr}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Storm severity">
            <select className={inputCls} value={severity} onChange={e=>setSeverity(e.target.value)}>
              <option value="watch">Tropical watch / advisory</option>
              <option value="moderate">Moderate storm warning</option>
              <option value="major">Major hurricane / severe event</option>
            </select>
          </Field>
        </div>
        <div className="flex gap-3 mt-3 text-xs text-zinc-400 flex-wrap">
          <span className="flex items-center gap-1"><CloudLightning size={13} className="text-amber-400"/> {STATES.find(s=>s.abbr===stateAbbr)?.name} avg outage exposure: <span className="font-mono text-amber-400 ml-1">{riskHours} hrs/yr</span></span>
          <span>{stateProspects.length} prospects in this state</span>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="text-center"><div className="text-2xl font-mono font-bold text-amber-400">{batteryProspects.length}</div><div className="text-xs text-zinc-400 mt-1">Battery owners</div><div className="text-[10px] text-zinc-600">Charge reminder</div></Card>
        <Card className="text-center"><div className="text-2xl font-mono font-bold text-blue-400">{pipelineProspects.length}</div><div className="text-xs text-zinc-400 mt-1">Pipeline leads</div><div className="text-[10px] text-zinc-600">FOMO follow-up</div></Card>
        <Card className="text-center"><div className="text-2xl font-mono font-bold text-emerald-400">{liveProspects.length}</div><div className="text-xs text-zinc-400 mt-1">Live systems</div><div className="text-[10px] text-zinc-600">Check-in</div></Card>
      </div>
      {batteryProspects.length>0 && (
        <Card className="border-amber-500/30">
          <Eyebrow>Battery owners — charge reminder</Eyebrow>
          {batteryProspects.map(p=>(
            <div key={p.id} className="border-b border-zinc-800 pb-3 mb-3 last:border-0 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <div><div className="text-sm font-medium text-zinc-100">{p.name}</div><div className="text-xs text-zinc-500">{p.city}, {p.state} · {p.stage}</div></div>
                <Btn variant="ghost" icon={Send} onClick={()=>onToast(`Charge reminder sent to ${p.name} (demo)`)}>Send</Btn>
              </div>
              <textarea className={`${inputCls} text-xs`} rows={2} readOnly value={batteryMsg(p)}/>
            </div>
          ))}
        </Card>
      )}
      {pipelineProspects.length>0 && (
        <Card className="border-blue-500/20">
          <Eyebrow>Pipeline leads — storm follow-up</Eyebrow>
          {pipelineProspects.slice(0,5).map(p=>(
            <div key={p.id} className="border-b border-zinc-800 pb-3 mb-3 last:border-0 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <div><div className="text-sm font-medium text-zinc-100">{p.name}</div><div className="text-xs text-zinc-500">{p.stage} · {fmtUSD(p.calc.totalMonthly)}/mo projected</div></div>
                <Btn variant="ghost" icon={Send} onClick={()=>onToast(`Storm follow-up sent to ${p.name} (demo)`)}>Send</Btn>
              </div>
              <textarea className={`${inputCls} text-xs`} rows={3} readOnly value={pipelineMsg(p)}/>
            </div>
          ))}
          {pipelineProspects.length>5 && <p className="text-xs text-zinc-500 mt-2">+{pipelineProspects.length-5} more pipeline leads in {STATES.find(s=>s.abbr===stateAbbr)?.name}</p>}
        </Card>
      )}
      {stateProspects.length===0 && <Card><p className="text-sm text-zinc-500">No prospects found in {STATES.find(s=>s.abbr===stateAbbr)?.name}. Add prospects from this state first via the New Prospect tab.</p></Card>}
    </div>
  );
}

/* ============== LEAD SOURCE ROI TRACKER ============== */
const LEAD_SOURCES = ['Door knock','Referral','Facebook / Instagram','Google','Trade show','Yard sign','Website / SEO','Cold call','Other'];
function LeadSourceView({ prospects, onUpdateLeadSource }){
  const [costs, setCosts] = useState({});
  const bySrc = useMemo(()=>{
    const map = {};
    LEAD_SOURCES.forEach(src=>{ map[src] = { leads:0, closed:0, volume:0 }; });
    map['Untagged'] = { leads:0, closed:0, volume:0 };
    prospects.forEach(p=>{
      const src = p.leadSource || 'Untagged';
      if(!map[src]) map[src] = { leads:0, closed:0, volume:0 };
      map[src].leads++;
      if(['Contract Signed','Equipment Ordered','Installed','Active (PTO)'].includes(p.stage)){
        map[src].closed++;
        map[src].volume += p.calc.net;
      }
    });
    return Object.entries(map).filter(([,v])=>v.leads>0).map(([src,v])=>({
      src, ...v,
      closeRate: v.leads>0 ? Math.round((v.closed/v.leads)*100) : 0,
      costPerLead: costs[src] || 0,
      roi: v.closed>0 && costs[src]>0 ? Math.round((v.volume - v.leads*costs[src]) / (v.leads*costs[src]) * 100) : null,
    })).sort((a,b)=>b.leads-a.leads);
  },[prospects, costs]);
  const chartData = bySrc.map(s=>({ name:s.src.split('/')[0].trim().split(' ')[0], leads:s.leads, closed:s.closed }));
  return (
    <div className="space-y-5">
      <Eyebrow>Lead source ROI tracker</Eyebrow>
      <Card>
        <p className="text-sm text-zinc-400 mb-4">Tag each prospect with how they came in. Track close rates and ROI by channel to see where the next marketing dollar should go.</p>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {prospects.map(p=>(
            <div key={p.id} className="flex items-center gap-2">
              <div className="text-xs text-zinc-300 w-32 flex-shrink-0 truncate">{p.name}</div>
              <select className={`${inputCls} py-1 text-xs flex-1`} value={p.leadSource||''} onChange={e=>onUpdateLeadSource(p.id, e.target.value)}>
                <option value="">-- untagged --</option>
                {LEAD_SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <div className="text-[10px] text-zinc-600 w-20 flex-shrink-0 text-right">{p.stage}</div>
            </div>
          ))}
          {prospects.length===0 && <p className="text-sm text-zinc-500">No prospects yet.</p>}
        </div>
      </Card>
      {bySrc.length>0 && (
        <Card>
          <Eyebrow>Channel performance</Eyebrow>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
              <XAxis dataKey="name" stroke="#71717a" fontSize={10}/>
              <YAxis stroke="#71717a" fontSize={10}/>
              <Tooltip contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
              <Bar dataKey="leads" fill="#3f3f46" radius={[4,4,0,0]} name="Leads"/>
              <Bar dataKey="closed" fill="#fbbf24" radius={[4,4,0,0]} name="Closed"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
      <Card>
        <Eyebrow>ROI by channel (enter cost per lead to unlock)</Eyebrow>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-zinc-500 border-b border-zinc-800">{['Source','Leads','Closed','Close rate','Volume','Cost/lead','ROI'].map(h=><th key={h} className="text-left pb-2 pr-3 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {bySrc.map(s=>(
                <tr key={s.src} className="border-b border-zinc-800/40">
                  <td className="py-2 pr-3 text-zinc-200">{s.src}</td>
                  <td className="py-2 pr-3 font-mono">{s.leads}</td>
                  <td className="py-2 pr-3 font-mono text-amber-400">{s.closed}</td>
                  <td className="py-2 pr-3 font-mono" style={{ color:s.closeRate>=50?'#34d399':s.closeRate>=25?'#fbbf24':'#71717a' }}>{s.closeRate}%</td>
                  <td className="py-2 pr-3 font-mono text-zinc-300">{s.volume>0?fmtUSD(s.volume):'—'}</td>
                  <td className="py-2 pr-3">
                    <input type="number" placeholder="0" value={costs[s.src]||''} onChange={e=>setCosts(c=>({...c,[s.src]:Number(e.target.value)}))} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-200 w-16 text-xs focus:outline-none focus:border-amber-500/60"/>
                  </td>
                  <td className="py-2 font-mono">{s.roi!=null?<span style={{ color:s.roi>=0?'#34d399':'#f87171' }}>{s.roi>=0?'+':''}{s.roi}%</span>:'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-zinc-600 mt-3">ROI = (closed volume - total channel spend) / total channel spend. Useful directionally — a full attribution model would account for multi-touch journeys.</p>
      </Card>
    </div>
  );
}

/* ============== COMMUNITY SOLAR EXPLAINER ============== */
const COMMUNITY_SOLAR = {
  NY:{ program:'NY Community DG', launched:2015, savingsRange:'10-15%', note:'One of the largest programs nationally. Wait lists vary by utility zone.' },
  MA:{ program:'Community Shared Solar', launched:2018, savingsRange:'10-15%', note:'Projects fill quickly in suburban areas. Strong consumer protections.' },
  IL:{ program:'IL Adjustable Block', launched:2021, savingsRange:'15-20%', note:'Strong incentives under the Climate and Equitable Jobs Act.' },
  CO:{ program:'Colorado Community Solar', launched:2015, savingsRange:'5-10%', note:'Xcel Energy and other utilities have separate offerings.' },
  MN:{ program:'MN Community Solar Garden', launched:2014, savingsRange:'5-10%', note:'One of the oldest programs in the country. Well-established market.' },
  MD:{ program:'MD Community Solar Pilot', launched:2016, savingsRange:'5-10%', note:'Capacity is expanding. Strong rural participation.' },
  NJ:{ program:'NJ Community Solar Pilot', launched:2019, savingsRange:'5-10%', note:'Early stage program with capacity expanding each cycle.' },
  OR:{ program:'Oregon Community Solar', launched:2017, savingsRange:'10-15%', note:'Regulated by PUC with strong consumer protections.' },
  WA:{ program:'WA Community Solar', launched:2020, savingsRange:'5-10%', note:'Newer program; watch for expansion in coming years.' },
  ME:{ program:'Maine Community Solar', launched:2019, savingsRange:'10-15%', note:'Strong rural market participation and fair subscriber rules.' },
  CT:{ program:'CT Solar Home RECs', launched:2018, savingsRange:'5-10%', note:'Available through Eversource and UI service territories.' },
  CA:{ program:'VNEM / NEM Aggregation', launched:2016, savingsRange:'5-10%', note:'Post-NEM 3.0 economics have shifted significantly. Verify current rates.' },
};
const COMMUNITY_SOLAR_STATES_LIST = Object.keys(COMMUNITY_SOLAR);
function CommunitySolarView({ loc, setLoc, prospects, setView }){
  const selState = STATES.find(s=>s.abbr===loc.stateAbbr) || STATES.find(s=>s.abbr==='NY');
  const program = COMMUNITY_SOLAR[selState.abbr];
  const unqualifiedProspects = prospects.filter(p=>{
    const st = STATES.find(s=>s.name.toLowerCase()===p.state.toLowerCase());
    return st && COMMUNITY_SOLAR_STATES_LIST.includes(st.abbr) && p.roof?.shadingPct>=30;
  });
  const followUpMsg = (p)=>`Hi ${p.name.split(' ')[0]}, even though your roof may not be the best fit for rooftop solar right now, ${p.state} has an active community solar program where you can subscribe to off-site solar and still reduce your electricity bill by ${program?.savingsRange||'5-15%'} with no installation needed. Happy to walk you through how it works.`;
  return (
    <div className="space-y-5">
      <Eyebrow>Community solar — for customers who cannot install</Eyebrow>
      <Card>
        <p className="text-sm text-zinc-400 mb-3">Renters, north-facing roofs, heavy shading, and condo owners can still go solar through a community subscription. No installation needed — they subscribe to a share of a remote solar farm and get a credit on their utility bill.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {COMMUNITY_SOLAR_STATES_LIST.map(abbr=>(
            <button key={abbr} onClick={()=>setLoc({ ...loc, stateAbbr:abbr })} className={`px-2.5 py-1.5 rounded-full text-xs font-mono transition ${selState.abbr===abbr?'bg-amber-500 text-zinc-950 font-bold':'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>{abbr}</button>
          ))}
        </div>
        <p className="text-xs text-zinc-500">States shown have active community solar programs. {50-COMMUNITY_SOLAR_STATES_LIST.length} states currently lack programs — rooftop or nothing in those markets.</p>
      </Card>
      {program ? (
        <Card className="border-amber-500/20">
          <Eyebrow>{selState.name} — {program.program}</Eyebrow>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <StatBlock icon={Globe} label="Program" value={program.program}/>
            <StatBlock icon={TrendingUp} label="Typical savings" value={program.savingsRange} sub="off utility bill"/>
            <StatBlock icon={Clock} label="Program active since" value={String(program.launched)}/>
          </div>
          <div className="flex items-start gap-2 bg-zinc-800 rounded-lg px-3 py-2.5 mb-4">
            <Info size={13} className="text-amber-400 mt-0.5 flex-shrink-0"/>
            <p className="text-xs text-zinc-400">{program.note}</p>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold text-zinc-300 mb-2">Agent talking points</div>
            {[
              `No panels on your roof — a remote solar farm generates the power and your utility credits your account directly.`,
              `Savings of ${program.savingsRange} off your electric bill with no installation, no permits, and no HOA approval needed.`,
              `You can cancel most subscriptions with 30-90 days notice — far lower commitment than a 25-year panel warranty.`,
              `If you move, you can often transfer the subscription or simply cancel — no equipment to worry about.`,
            ].map((pt,i)=>(
              <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0"/>
                {pt}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-zinc-500">{selState.name} does not currently have an active community solar program. In states without a program, rooftop solar or nothing are the only options — or the customer may qualify for a neighboring state program if they have property there.</p>
        </Card>
      )}
      {unqualifiedProspects.length>0 && (
        <Card>
          <Eyebrow>Prospects who may benefit — high shading detected</Eyebrow>
          {unqualifiedProspects.map(p=>{
            const pState = STATES.find(s=>s.name.toLowerCase()===p.state.toLowerCase());
            const pProgram = pState ? COMMUNITY_SOLAR[pState.abbr] : null;
            return pProgram ? (
              <div key={p.id} className="border-b border-zinc-800 pb-3 mb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div><div className="text-sm font-medium text-zinc-100">{p.name}</div><div className="text-xs text-zinc-500">{p.city}, {p.state} · {p.roof.shadingPct}% shading</div></div>
                  <Btn variant="ghost" icon={Send} onClick={()=>{}}>Send follow-up</Btn>
                </div>
                <textarea className={`${inputCls} text-xs`} rows={3} readOnly value={followUpMsg(p)}/>
              </div>
            ) : null;
          })}
        </Card>
      )}
    </div>
  );
}

/* ============== COMPETITOR QUOTE COMPARATOR ============== */
const COMPETITOR_PRESETS = [
  { name:'SunPower / Complete Solaria', ppw:3.75, warrantyYears:25, warrantyCovers:'parts, labor & production', degradationPct:0.25, microinverter:true, financing:['cash','loan','lease'], notes:'Premium brand, 25yr full warranty strong, but highest price-per-watt in market.' },
  { name:'Sunrun', ppw:3.40, warrantyYears:10, warrantyCovers:'workmanship only', degradationPct:0.50, microinverter:false, financing:['lease','ppa'], notes:'Lease/PPA specialist — customer never owns the system, no ITC.' },
  { name:'Vivint Solar / SunPower Leasing', ppw:3.20, warrantyYears:10, warrantyCovers:'workmanship only', degradationPct:0.50, microinverter:false, financing:['lease'], notes:'Door-to-door heavy; lease-only means customer gets no SREC income or tax credit.' },
  { name:'Freedom Forever', ppw:3.05, warrantyYears:25, warrantyCovers:'production guarantee', degradationPct:0.50, microinverter:false, financing:['cash','loan'], notes:'25yr production guarantee is a differentiator, but verify the claims carefully.' },
  { name:'Tesla Energy', ppw:2.80, warrantyYears:10, warrantyCovers:'parts only', degradationPct:0.50, microinverter:false, financing:['cash','loan'], notes:'Lowest online pricing but fully self-service — no local agent, no relationship.' },
  { name:'Local / Regional Installer', ppw:3.10, warrantyYears:10, warrantyCovers:'workmanship only', degradationPct:0.50, microinverter:false, financing:['cash','loan'], notes:'Varies widely. Check BBB, licensing, insurance, and how long in business.' },
];

const OUR_DEFAULTS = { warrantyYears:10, warrantyCovers:'parts & workmanship', degradationPct:0.50, microinverter:true, financing:['cash','loan','lease','ppa'], ppwBase:3.10 };

function WinBadge({ wins }){
  if(!wins) return null;
  return <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">OUR WIN</span>;
}

function CompRow({ label, ours, theirs, oursWins, detail }){
  return (
    <tr className="border-b border-zinc-800 text-sm">
      <td className="py-2.5 pr-3 text-zinc-500 align-top whitespace-nowrap">{label}</td>
      <td className={`py-2.5 pr-3 font-medium align-top ${oursWins ? 'text-amber-300' : 'text-zinc-200'}`}>
        {ours}{oursWins && <WinBadge wins/>}
      </td>
      <td className="py-2.5 text-zinc-400 align-top">{theirs}</td>
      {detail && <td className="py-2.5 pl-3 text-[11px] text-zinc-600 align-top max-w-[180px]">{detail}</td>}
    </tr>
  );
}

function CompetitorComparatorView({ prospects, selectedId, setSelectedId }){
  const [presetIdx, setPresetIdx] = useState(0);
  const [custom, setCustom] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editBuf, setEditBuf] = useState({});

  const prospect = prospects.find(p=>p.id===selectedId);
  const comp = custom || COMPETITOR_PRESETS[presetIdx];
  const calc = prospect?.calc;

  /* our system for this prospect */
  const ourPpw = OUR_DEFAULTS.ppwBase;
  const ourSystemKw = calc?.systemKw || 8;
  const ourGross = ourSystemKw*1000*ourPpw;
  const ourNet = ourGross*0.70;

  /* competitor numbers */
  const compGross = ourSystemKw*1000*comp.ppw;
  const compNet = comp.financing.includes('cash')||comp.financing.includes('loan') ? compGross*0.70 : compGross; // lease/ppa = no ITC
  const compNoItc = !comp.financing.includes('cash') && !comp.financing.includes('loan');

  /* 25yr value comparison with degradation */
  const ourMonthly = calc?.totalMonthly || 0;
  const compMonthly = ourMonthly * (comp.degradationPct<=0.30 ? 1.02 : comp.degradationPct>=0.55 ? 0.97 : 1.0);
  function calcCumulative(monthly, gross, degradation, years=25){
    let cum = -gross; let m = monthly;
    for(let y=0;y<years;y++){ cum += m*12; m *= (1-(degradation/100)); }
    return Math.round(cum);
  }
  const our25 = calc ? calcCumulative(ourMonthly, ourNet, OUR_DEFAULTS.degradationPct) : 0;
  const comp25 = calcCumulative(compMonthly, compNoItc?compGross:compNet, comp.degradationPct);
  const ourWins25 = our25 > comp25;

  /* chart data */
  const chartData = [];
  for(let y=0;y<=25;y++){
    let ourCum = -ourNet, compCum = -(compNoItc?compGross:compNet);
    let ourM = ourMonthly, compM = compMonthly;
    for(let i=0;i<y;i++){
      ourCum += ourM*12; ourM *= (1-(OUR_DEFAULTS.degradationPct/100));
      compCum += compM*12; compM *= (1-(comp.degradationPct/100));
    }
    chartData.push({ year:y, us: Math.round(ourCum), them: Math.round(compCum) });
  }

  function startEdit(){
    setEditBuf({ name:comp.name, ppw:comp.ppw, warrantyYears:comp.warrantyYears, warrantyCovers:comp.warrantyCovers, degradationPct:comp.degradationPct, microinverter:comp.microinverter, notes:comp.notes });
    setEditing(true);
  }
  function saveEdit(){
    setCustom({ ...comp, ...editBuf, ppw:Number(editBuf.ppw), warrantyYears:Number(editBuf.warrantyYears), degradationPct:Number(editBuf.degradationPct) });
    setEditing(false);
  }

  const scoreUs = [
    ourNet <= compNet ? 1:0,
    OUR_DEFAULTS.warrantyYears >= comp.warrantyYears ? 1:0,
    OUR_DEFAULTS.degradationPct <= comp.degradationPct ? 1:0,
    OUR_DEFAULTS.microinverter && !comp.microinverter ? 1:0,
    OUR_DEFAULTS.financing.length >= comp.financing.length ? 1:0,
    ourWins25 ? 1:0,
  ].reduce((a,b)=>a+b,0);

  return (
    <div className="space-y-5">
      <Eyebrow>Competitor quote comparator</Eyebrow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <Field label="Attach to prospect (optional)">
            <select className={inputCls} value={selectedId||''} onChange={e=>setSelectedId(e.target.value||null)}>
              <option value="">Generic comparison (no prospect)</option>
              {prospects.map(p=><option key={p.id} value={p.id}>{p.name} — {fmtNum(p.calc.systemKw,2)} kW</option>)}
            </select>
          </Field>
        </Card>
        <Card>
          <Field label="Competitor / their quote">
            <select className={inputCls} value={custom?'custom':presetIdx} onChange={e=>{ if(e.target.value==='custom') return; setCustom(null); setPresetIdx(Number(e.target.value)); }}>
              {COMPETITOR_PRESETS.map((c,i)=><option key={i} value={i}>{c.name}</option>)}
              {custom && <option value="custom">{custom.name} (custom)</option>}
            </select>
          </Field>
        </Card>
      </div>

      {/* scoreboard */}
      <Card className="border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Medal size={20} className="text-amber-400"/>
            <div>
              <div className="font-semibold text-zinc-100">SolarVault wins <span className="font-mono text-amber-400">{scoreUs}</span> of 6 categories</div>
              <div className="text-xs text-zinc-500">vs. {comp.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="ghost" icon={editing?Save:Scale} onClick={editing?saveEdit:startEdit}>{editing?'Save':'Edit comp. quote'}</Btn>
            {custom && !editing && <Btn variant="ghost" icon={RotateCcw} onClick={()=>{ setCustom(null); }}>Reset</Btn>}
          </div>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-zinc-800 pt-4">
            <Field label="Competitor name"><input className={inputCls} value={editBuf.name} onChange={e=>setEditBuf(b=>({...b,name:e.target.value}))}/></Field>
            <Field label="Price per watt ($)"><input type="number" step="0.05" className={inputCls} value={editBuf.ppw} onChange={e=>setEditBuf(b=>({...b,ppw:e.target.value}))}/></Field>
            <Field label="Warranty (years)"><input type="number" className={inputCls} value={editBuf.warrantyYears} onChange={e=>setEditBuf(b=>({...b,warrantyYears:e.target.value}))}/></Field>
            <Field label="Warranty covers"><input className={inputCls} value={editBuf.warrantyCovers} onChange={e=>setEditBuf(b=>({...b,warrantyCovers:e.target.value}))}/></Field>
            <Field label="Annual degradation (%)"><input type="number" step="0.05" className={inputCls} value={editBuf.degradationPct} onChange={e=>setEditBuf(b=>({...b,degradationPct:e.target.value}))}/></Field>
            <Field label="Microinverters?">
              <select className={inputCls} value={editBuf.microinverter?'yes':'no'} onChange={e=>setEditBuf(b=>({...b,microinverter:e.target.value==='yes'}))}>
                <option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Notes (for agent reference)" className="md:col-span-2"><textarea className={inputCls} rows={2} value={editBuf.notes} onChange={e=>setEditBuf(b=>({...b,notes:e.target.value}))}/></Field>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-zinc-500 border-b border-zinc-800">
                  <th className="text-left pb-2 pr-3 font-normal">Category</th>
                  <th className="text-left pb-2 pr-3 font-normal text-amber-400">SolarVault</th>
                  <th className="text-left pb-2 font-normal">{comp.name}</th>
                  <th className="text-left pb-2 pl-3 font-normal hidden md:table-cell">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                <CompRow label="Net system cost"
                  ours={prospect ? fmtUSD(ourNet) : `$${ourPpw.toFixed(2)}/W`}
                  theirs={prospect ? fmtUSD(compNoItc?compGross:compNet) : `$${comp.ppw.toFixed(2)}/W`}
                  oursWins={ourNet <= (compNoItc?compGross:compNet)}
                  detail={compNoItc?"Their lease/PPA means customer pays more long-term and gets no 30% tax credit":""}/>
                <CompRow label="30% ITC eligible"
                  ours="Yes — customer owned"
                  theirs={compNoItc?"No — lessor keeps credit":"Yes"}
                  oursWins={compNoItc}
                  detail="Federal tax credit is $5k–$15k on a typical system — a major factor in true cost."/>
                <CompRow label="Warranty"
                  ours={`${OUR_DEFAULTS.warrantyYears}yr — ${OUR_DEFAULTS.warrantyCovers}`}
                  theirs={`${comp.warrantyYears}yr — ${comp.warrantyCovers}`}
                  oursWins={OUR_DEFAULTS.warrantyYears>=comp.warrantyYears}
                  detail="Labor coverage after year 10 is often where budget installers fall short."/>
                <CompRow label="Annual degradation"
                  ours={`~${OUR_DEFAULTS.degradationPct}%/yr`}
                  theirs={`~${comp.degradationPct}%/yr`}
                  oursWins={OUR_DEFAULTS.degradationPct<=comp.degradationPct}
                  detail="At 0.5%/yr, year-25 output is ~87% of day-1. Matters across a 25yr contract."/>
                <CompRow label="Inverter technology"
                  ours="Microinverter (per-panel MPPT)"
                  theirs={comp.microinverter?"Microinverter":"String inverter"}
                  oursWins={OUR_DEFAULTS.microinverter && !comp.microinverter}
                  detail="Microinverters eliminate single-point failure and enable panel-level monitoring."/>
                <CompRow label="Financing options"
                  ours="Cash, loan, lease, PPA"
                  theirs={comp.financing.join(', ')}
                  oursWins={OUR_DEFAULTS.financing.length>=comp.financing.length}
                  detail="More options means more customers qualify — especially important for credit-constrained buyers."/>
                {prospect && <CompRow label="25-yr net position"
                  ours={fmtUSD(our25)}
                  theirs={fmtUSD(comp25)}
                  oursWins={ourWins25}
                  detail="Cumulative benefit minus net system cost, applying each side's degradation rate."/>}
              </tbody>
            </table>
          </div>
        )}

        {comp.notes && !editing && (
          <div className="mt-4 flex items-start gap-2 bg-zinc-800 rounded-lg px-3 py-2.5">
            <Info size={13} className="text-amber-400 mt-0.5 flex-shrink-0"/>
            <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-zinc-200">Agent note — </span>{comp.notes}</p>
          </div>
        )}
      </Card>

      {prospect && (
        <Card>
          <Eyebrow>25-year net position — SolarVault vs. {comp.name}</Eyebrow>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickFormatter={y=>`Yr ${y}`}/>
              <YAxis stroke="#71717a" fontSize={11} tickFormatter={v=>`$${Math.round(v/1000)}k`}/>
              <Tooltip formatter={(v,n)=>[fmtUSD(v), n==='us'?'SolarVault':comp.name]} labelFormatter={y=>`Year ${y}`} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
              <Line type="monotone" dataKey="us" stroke="#fbbf24" strokeWidth={3} dot={false} name="us"/>
              <Line type="monotone" dataKey="them" stroke="#71717a" strokeWidth={2} dot={false} strokeDasharray="5 4" name="them"/>
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-zinc-600 mt-2">Both curves apply their respective annual degradation rates. SolarVault assumes customer-owned financing (ITC included); if competitor quote is lease/PPA, their curve reflects the full un-discounted system cost to the customer.</p>
        </Card>
      )}

      <p className="text-[11px] text-zinc-600">Competitor figures are illustrative defaults drawn from publicly available pricing and product specs — actual quotes vary. Always verify the customer's specific competitor proposal before making comparison claims to them.</p>
    </div>
  );
}

/* ============== COMMISSION TRACKER ============== */
const COMMISSION_TIERS = [
  { stage:'Contract Signed', rate:0.005, label:'0.5% — signed bonus' },
  { stage:'Equipment Ordered', rate:0.010, label:'1.0% — order bonus' },
  { stage:'Installed', rate:0.020, label:'2.0% — install bonus' },
  { stage:'Active (PTO)', rate:0.030, label:'3.0% — full commission' },
];
const LEADERBOARD_SEED = [
  { name:'Aaliyah Brooks', closed:4, volume:148200, earned:4446 },
  { name:'Devon Castillo', closed:3, volume:112800, earned:3384 },
  { name:'Priya Nair', closed:5, volume:187500, earned:5625 },
  { name:'Jordan West', closed:2, volume:74300, earned:2229 },
];

function commissionForProspect(p){
  const systemValue = p.calc.net;
  const tierIdx = COMMISSION_TIERS.findIndex(t=>t.stage===p.stage);
  if(tierIdx<0) return 0;
  return systemValue * COMMISSION_TIERS[tierIdx].rate;
}

function CommissionView({ prospects }){
  const [myName, setMyName] = useState('You');
  const [customRate, setCustomRate] = useState(3.0);

  const closedProspects = prospects.filter(p=>['Contract Signed','Equipment Ordered','Installed','Active (PTO)'].includes(p.stage));
  const ptoClosed = prospects.filter(p=>p.stage==='Active (PTO)');
  const totalPipeline = prospects.reduce((s,p)=>s+p.calc.net,0);
  const totalEarned = closedProspects.reduce((s,p)=>s+commissionForProspect(p),0);
  const totalPtoEarned = ptoClosed.reduce((s,p)=>s+p.calc.net*(customRate/100),0);

  const myEntry = { name: myName||'You', closed:ptoClosed.length, volume:ptoClosed.reduce((s,p)=>s+p.calc.net,0), earned:totalPtoEarned };
  const board = [...LEADERBOARD_SEED, myEntry].sort((a,b)=>b.earned-a.earned);
  const myRank = board.findIndex(e=>e.name===myEntry.name)+1;

  return (
    <div className="space-y-5">
      <Eyebrow>Commission tracker & leaderboard</Eyebrow>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><StatBlock icon={DollarSign} label="Total pipeline value" value={fmtUSD(totalPipeline)} sub="all prospects, gross"/></Card>
        <Card><StatBlock icon={TrendingUp} label="Commissions earned" value={fmtUSD(totalEarned)} sub="by current stage"/></Card>
        <Card><StatBlock icon={CheckCircle2} label="PTO closed" value={ptoClosed.length} sub="fully active"/></Card>
        <Card><StatBlock icon={Trophy} label="Leaderboard rank" value={`#${myRank}`} sub={`of ${board.length} agents`}/></Card>
      </div>

      <Card>
        <Eyebrow>Commission settings</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Your name (for leaderboard)"><input className={inputCls} value={myName} onChange={e=>setMyName(e.target.value)} placeholder="Your name"/></Field>
          <Field label={`Full commission rate — ${fmtNum(customRate,1)}% of net system cost`}><input type="range" min={1} max={6} step={0.25} value={customRate} onChange={e=>setCustomRate(Number(e.target.value))} className="w-full accent-amber-500"/></Field>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMISSION_TIERS.map(t=>(
            <div key={t.stage} className="bg-zinc-800 rounded-lg px-3 py-2 text-xs">
              <div className="text-zinc-500 mb-1">{t.stage}</div>
              <div className="font-mono text-amber-400">{t.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-zinc-600 mt-2">Staged commission tiers shown are illustrative — override the final rate above to match your agency's actual agreement.</p>
      </Card>

      <Card>
        <Eyebrow>Prospect commission breakdown</Eyebrow>
        {prospects.length===0 ? <p className="text-sm text-zinc-500">No prospects yet.</p> : (
          <div className="space-y-1.5">
            {prospects.map(p=>{
              const comm = commissionForProspect(p);
              const tier = COMMISSION_TIERS.find(t=>t.stage===p.stage);
              return (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-zinc-800 pb-1.5">
                  <div>
                    <div className="text-zinc-200">{p.name}</div>
                    <div className="text-[11px] text-zinc-500">{p.city}, {p.state} · {p.stage}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-amber-400">{comm>0?fmtUSD(comm):'—'}</div>
                    <div className="text-[11px] text-zinc-600">{tier?tier.label:'Not yet eligible'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <Eyebrow>Agent leaderboard — this month</Eyebrow>
        <div className="space-y-2">
          {board.map((agent,i)=>{
            const isMe = agent.name===myEntry.name;
            return (
              <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isMe?'bg-amber-500/15 border border-amber-500/30':'bg-zinc-800'}`}>
                <div className="font-mono text-lg w-8 text-center" style={{ color: i===0?'#fbbf24':i===1?'#94a3b8':i===2?'#b45309':'#52525b' }}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                </div>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${isMe?'text-amber-300':'text-zinc-200'}`}>{agent.name}{isMe?' (you)':''}</div>
                  <div className="text-[11px] text-zinc-500">{agent.closed} closed · {fmtUSD(agent.volume)} volume</div>
                </div>
                <div className="font-mono text-amber-400 font-semibold">{fmtUSD(agent.earned)}</div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-zinc-600 mt-3">Leaderboard peers are illustrative seed data. A production build would pull live data from your agency's CRM or payroll system.</p>
      </Card>

      <Card>
        <Eyebrow>Monthly volume chart</Eyebrow>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={board.sort((a,b)=>b.earned-a.earned)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false}/>
            <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickFormatter={n=>n.split(' ')[0]}/>
            <YAxis stroke="#71717a" fontSize={10} tickFormatter={v=>`$${Math.round(v/1000)}k`}/>
            <Tooltip formatter={v=>fmtUSD(v)} contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:8, fontSize:12 }}/>
            <Bar dataKey="earned" radius={[6,6,0,0]}>
              {board.map((e,i)=><Cell key={i} fill={e.name===myEntry.name?'#fbbf24':'#3f3f46'}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ============== PIPELINE ============== */
const STAGES = ['Lead','Contacted','Site Survey','Proposal Sent','Contract Signed','Equipment Ordered','Installed','Active (PTO)'];
function PipelineView({ prospects, onUpdateStage, onSelect, setView }){
  const [followUpFor, setFollowUpFor] = useState(null);
  const [channel, setChannel] = useState('email');
  const fp = prospects.find(p=>p.id===followUpFor);
  return (
    <div className="space-y-4">
      <Eyebrow>Pipeline & follow-ups</Eyebrow>
      {prospects.length===0 && <Card><p className="text-sm text-zinc-500">No prospects yet.</p></Card>}
      <div className="space-y-2">
        {prospects.map(p=>(
          <Card key={p.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="font-medium text-zinc-100">{p.name}</div>
              <div className="text-xs text-zinc-500">{p.city}, {p.state} · {fmtUSD(p.calc.totalMonthly)}/mo benefit</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select className={`${inputCls} w-auto py-1.5`} value={p.stage} onChange={e=>onUpdateStage(p.id, e.target.value)}>
                {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <Btn variant="outline" onClick={()=>{ onSelect(p.id); setView('portfolio'); }}>Portfolio</Btn>
              <Btn variant="ghost" icon={Send} onClick={()=>setFollowUpFor(p.id)}>Follow up</Btn>
            </div>
          </Card>
        ))}
      </div>
      {fp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40" onClick={()=>setFollowUpFor(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-md w-full" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-zinc-100">Follow up with {fp.name}</h3>
              <button onClick={()=>setFollowUpFor(null)}><X size={16} className="text-zinc-500"/></button>
            </div>
            <div className="flex gap-2 mb-3">
              <button onClick={()=>setChannel('email')} className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 ${channel==='email'?'bg-amber-500 text-zinc-950':'bg-zinc-800 text-zinc-400'}`}><Mail size={12}/> Email</button>
              <button onClick={()=>setChannel('text')} className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 ${channel==='text'?'bg-amber-500 text-zinc-950':'bg-zinc-800 text-zinc-400'}`}><Phone size={12}/> Text</button>
            </div>
            <textarea className={inputCls} rows={5} readOnly value={
              channel==='email'
              ? `Hi ${fp.name.split(' ')[0]},\n\nJust checking in on your solar proposal for ${fp.address}. Your projected system would save an estimated ${fmtUSD(fp.calc.totalMonthly)}/mo. Happy to answer any questions or move forward whenever you're ready.\n\nBest,\nYour SolarVault agent`
              : `Hi ${fp.name.split(' ')[0]}, following up on your solar proposal — est. ${fmtUSD(fp.calc.totalMonthly)}/mo savings. Any questions before we move forward?`
            }/>
            <Btn className="mt-3 w-full justify-center" icon={Send} onClick={()=>setFollowUpFor(null)}>Send {channel} (demo)</Btn>
            <p className="text-[11px] text-zinc-600 mt-2">Connect an email/SMS provider to send for real — this composes the message only.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============== APP SHELL ============== */
const NAV_ALL = [
  { id:'dashboard', label:'Dashboard', icon:Gauge },
  { id:'ratings', label:'Solar Ratings', icon:MapPin },
  { id:'calculator', label:'Calculator', icon:Calculator },
  { id:'ev', label:'EV Sizing', icon:Car },
  { id:'rebates', label:'Rebates', icon:Percent },
  { id:'financing', label:'Financing', icon:Landmark },
  { id:'lenders', label:'Lenders', icon:Banknote },
  { id:'competitor', label:'Competitor', icon:Scale },
  { id:'hoarights', label:'HOA Rights', icon:Shield },
  { id:'communitysolar', label:'Community Solar', icon:Globe },
  { id:'billanalyzer', label:'Bill Analyzer', icon:Camera },
  { id:'copilot', label:'AI Co-Pilot', icon:Bot },
  { id:'training', label:'Training', icon:GraduationCap },
  { id:'narrative', label:'Narrative', icon:Sparkles },
  { id:'roof', label:'Roof Viewer', icon:Box },
  { id:'onboarding', label:'New Prospect', icon:UserPlus },
  { id:'pipeline', label:'Pipeline', icon:ListChecks },
  { id:'portfolio', label:'Portfolio', icon:FileText },
  { id:'export', label:'Export / QR', icon:FileDown },
  { id:'customerportal', label:'Customer Portal', icon:Smartphone },
  { id:'referral', label:'Referral', icon:Gift },
  { id:'storm', label:'Storm Outreach', icon:CloudLightning },
  { id:'documents', label:'Documents', icon:FileSignature },
  { id:'equipment', label:'Equipment', icon:ShoppingCart },
  { id:'permits', label:'Permits & HOA', icon:ClipboardCheck },
  { id:'commission', label:'Commission', icon:Trophy },
  { id:'leadsource', label:'Lead Source ROI', icon:Target },
];
const NAV_GROUPS = [
  { id:'home',      label:'Home',        icon:Gauge,         color:'#fbbf24', items:['dashboard'] },
  { id:'tools',     label:'Tools',       icon:Calculator,    color:'#60a5fa', items:['ratings','calculator','ev','rebates','financing','lenders','competitor','hoarights','communitysolar','billanalyzer'] },
  { id:'pitch',     label:'Pitch',       icon:Sparkles,      color:'#f472b6', items:['copilot','training','narrative','roof'] },
  { id:'prospects', label:'Prospects',   icon:Users,         color:'#34d399', items:['onboarding','pipeline','portfolio','export','customerportal','referral','storm'] },
  { id:'ops',       label:'Operations',  icon:ClipboardCheck,color:'#a78bfa', items:['documents','equipment','permits'] },
  { id:'agency',    label:'Agency',      icon:Trophy,         color:'#fb923c', items:['commission','leadsource'] },
];

function seedProspect(){
  const state = STATES.find(s=>s.abbr==='AZ');
  const city = state.cities[0];
  const touFactor = getTouFactor(state.abbr, false);
  const calc = estimateSolar(city, { touFactor });
  const base = { calc, name:'Marcus Reed', address:'128 Desert Willow Dr', city:city.name, state:state.name };
  return {
    id:'demo-1', name:'Marcus Reed', email:'marcus.reed@email.com', phone:'(602) 555-0148',
    address:'128 Desert Willow Dr', state:state.name, city:city.name,
    sunHours:city.sunHours, consistentDays:city.consistentDays, billMonthly:city.bill, rate:city.rate,
    roof:{ widthFt:34, depthFt:24, pitchDeg:22, azimuthDeg:180, shadingPct:8 },
    stage:'Proposal Sent', createdAt:Date.now(), calc, srec:null, plansBattery:false, touFactor, leadSource:'Door knock',
    documents:[
      { id:'d1', type:'Proposal', status:'completed', body: docBody('Proposal', base) },
      { id:'d2', type:'Service Agreement', status:'partially_signed', signatureAgent:null, signatureCustomer:null, body: docBody('Service Agreement', base) },
    ],
    equipmentOrders:[],
  };
}

/* ============== AUTH VIEW ============== */
function AuthView({ onAuth }){
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', agency:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));

  async function submit(){
    setError(''); setLoading(true);
    if(mode==='signup'){
      if(!form.name||!form.agency||!form.email||!form.password){ setError('All fields are required.'); setLoading(false); return; }
      if(form.password.length<6){ setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const user = { name:form.name, agency:form.agency, email:form.email, hasSeenTutorial:false };
      try{ localStorage.setItem('sv_user', JSON.stringify({ ...user, pw:form.password })); }catch(e){}
      onAuth(user);
    } else {
      try{
        const res = {value: localStorage.getItem('sv_user')};
        if(!res){ setError('No account found — sign up first.'); setLoading(false); return; }
        const stored = JSON.parse(res.value);
        if(stored.email.toLowerCase()!==form.email.toLowerCase()){ setError('Email not recognised.'); setLoading(false); return; }
        if(stored.pw!==form.password){ setError('Incorrect password.'); setLoading(false); return; }
        onAuth({ name:stored.name, agency:stored.agency, email:stored.email, hasSeenTutorial:stored.hasSeenTutorial||false });
      }catch(e){ setError('Could not log in — try signing up.'); setLoading(false); }
    }
    setLoading(false);
  }

  const features = [
    { icon:MapPin, text:'Solar ratings for all 50 states — city and neighborhood level' },
    { icon:Sparkles, text:'AI-powered pitch tools, objection handling, and proposal narratives' },
    { icon:Users, text:'Full CRM from first contact to active install and beyond' },
    { icon:Calculator, text:'Savings modeling with rate escalation, TOU, SREC, and full rebate stacks' },
    { icon:FileSignature, text:'E-signature contracts, equipment ordering, permit tracking' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Left panel — branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-zinc-900 via-amber-950/30 to-zinc-900 flex flex-col justify-between p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
              <Sun size={20} className="text-zinc-950"/>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-50 tracking-tight">SolarVault</div>
              <div className="text-xs text-zinc-500">Agent Console</div>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-50 leading-tight mb-3">The complete solar sales platform.</h1>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">From your first knock to a live system — ratings, proposals, contracts, equipment, permits, and AI pitch tools in one place.</p>
          <div className="space-y-3">
            {features.map((f,i)=>(
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <f.icon size={13} className="text-amber-400"/>
                </div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-zinc-600 mt-8">Credentials are stored locally in your browser for this demo. No data leaves your device.</p>
      </div>

      {/* Right panel — form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-zinc-50 mb-1">{mode==='signup' ? 'Create your account' : 'Welcome back'}</h2>
          <p className="text-sm text-zinc-500 mb-6">{mode==='signup' ? 'Get started — takes 30 seconds.' : 'Log in to your SolarVault console.'}</p>

          <div className="space-y-3">
            {mode==='signup' && (
              <>
                <Field label="Full name"><input className={inputCls} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Jordan Rivera" autoFocus/></Field>
                <Field label="Agency / company"><input className={inputCls} value={form.agency} onChange={e=>set('agency',e.target.value)} placeholder="Sunbelt Solar LLC"/></Field>
              </>
            )}
            <Field label="Email address"><input className={inputCls} type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@agency.com" autoFocus={mode==='login'}/></Field>
            <Field label="Password">
              <div className="relative">
                <input className={inputCls} type={showPw?'text':'password'} value={form.password} onChange={e=>set('password',e.target.value)} placeholder={mode==='signup'?'Min 6 characters':'Your password'} onKeyDown={e=>{ if(e.key==='Enter') submit(); }}/>
                <button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </Field>
          </div>

          {error && <div className="mt-3 text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">{error}</div>}

          <button onClick={submit} disabled={loading} className="mt-5 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-semibold rounded-lg px-4 py-2.5 text-sm transition">
            <LogIn size={15}/> {loading ? (mode==='signup'?'Creating account…':'Logging in…') : (mode==='signup'?'Create account':'Log in')}
          </button>

          <div className="mt-4 text-center text-xs text-zinc-500">
            {mode==='signup' ? (
              <span>Already have an account? <button onClick={()=>{ setMode('login'); setError(''); }} className="text-amber-400 hover:underline">Log in</button></span>
            ) : (
              <span>New to SolarVault? <button onClick={()=>{ setMode('signup'); setError(''); }} className="text-amber-400 hover:underline">Create an account</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== FIRST-TIME TUTORIAL ============== */
const TUTORIAL_STEPS = [
  { emoji:'🌟', groupColor:null, title:'Welcome to SolarVault', subtitle:'Your complete solar sales platform', body:`You now have the most comprehensive solar agent tool in the industry — market intelligence, AI pitch support, a full CRM, contracts, equipment ordering, permit tracking, and more. This quick tour shows you where everything lives.` },
  { emoji:'🔭', groupColor:'#60a5fa', groupName:'Tools', title:'Research any market in seconds', subtitle:'10 tools under one roof', body:`The Tools section covers everything before you knock on a door. Solar ratings for all 50 states and their cities, a savings calculator with rate escalation and TOU modeling, EV integration, full rebate and SREC stacking, financing comparisons, lender marketplace, competitor analysis, HOA rights by state, community solar, and the bill photo analyzer.` },
  { emoji:'🎯', groupColor:'#f472b6', groupName:'Pitch', title:'AI tools for the field', subtitle:'Real-time sales support', body:`The Pitch section has four tools for during the sale. The AI Co-Pilot answers objections live — type what the customer just said and get a ready-to-use talking point. Training mode lets you practice a full pitch against AI customer personas. Narrative generates a personalized proposal write-up in seconds. The Roof Viewer lets you walk customers through a 3D model of their panels and sun path.` },
  { emoji:'👥', groupColor:'#34d399', groupName:'Prospects', title:'Your CRM — start to close', subtitle:'Full pipeline management', body:`The Prospects section is your deal pipeline. Start in New Prospect to onboard a lead — the app builds a digital portfolio instantly. Track all deals in Pipeline with stage management and follow-up message drafting. Export generates a print-ready proposal with QR code. The Customer Portal lets customers check their project status. Referral creates impact certificates for live systems. Storm Outreach surfaces timely follow-ups when weather hits your territory.` },
  { emoji:'📋', groupColor:'#a78bfa', groupName:'Operations', title:'Deal execution', subtitle:'Contracts, gear, permits', body:`The Operations section handles the back half of the deal. Documents has a live e-signature pad — both agent and customer sign on-screen and the status is tracked per document. Equipment lets you build an order from approved distributor catalogs and attaches the invoice to the prospect file. Permits tracks the 7-step interconnection checklist and generates HOA approval letters on the spot.` },
  { emoji:'📈', groupColor:'#fb923c', groupName:'Agency', title:'Track your performance', subtitle:'Commission and channel ROI', body:`The Agency section is your business dashboard. Commission shows your earnings by stage, a per-prospect breakdown, and your rank on the team leaderboard. Lead Source ROI lets you tag every prospect with how they came in and calculates cost-per-close and ROI by channel — so you know exactly where the next marketing dollar should go.` },
  { emoji:'🚀', groupColor:null, title:'Ready to go', subtitle:'Your first move', body:`The fastest way to see the full workflow: go to Prospects and open the New Prospect tab. Fill in a customer name, address, and utility bill — the app builds a complete digital portfolio in seconds. A demo prospect is already loaded so you can explore every feature right now. Go close some deals.` },
];

function TutorialOverlay({ user, onComplete }){
  const [step, setStep] = useState(0);
  const cur = TUTORIAL_STEPS[step];
  const isLast = step===TUTORIAL_STEPS.length-1;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" style={{ backdropFilter:'blur(4px)' }}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Top accent bar colored by group */}
        <div className="h-1" style={{ background: cur.groupColor ? `linear-gradient(90deg, ${cur.groupColor}88, ${cur.groupColor}22)` : 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}/>

        <div className="p-7">
          {/* Emoji + group badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">{cur.emoji}</div>
            {cur.groupColor && cur.groupName && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background:cur.groupColor+'22', color:cur.groupColor }}>
                {cur.groupName} section
              </span>
            )}
            {step===0 && <span className="text-[11px] text-zinc-500">Hi, {user.name.split(' ')[0]} 👋</span>}
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-zinc-50 mb-1">{cur.title}</h3>
          <div className="text-xs text-zinc-500 mb-3">{cur.subtitle}</div>
          <p className="text-sm text-zinc-400 leading-relaxed">{cur.body}</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6 mb-5">
            {TUTORIAL_STEPS.map((_,i)=>(
              <button key={i} onClick={()=>setStep(i)} className="rounded-full transition-all" style={{ width: i===step?20:6, height:6, background: i===step?'#fbbf24':i<step?'#fbbf2460':'#3f3f46' }}/>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={onComplete} className="text-xs text-zinc-600 hover:text-zinc-400 transition">Skip tour</button>
            <div className="flex items-center gap-2">
              {step>0 && <button onClick={()=>setStep(s=>s-1)} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition">Back</button>}
              <button onClick={()=>{ if(isLast) onComplete(); else setStep(s=>s+1); }} className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition flex items-center gap-2">
                {isLast ? <><CheckCircle2 size={14}/> Get started</> : <>Next <ChevronRight size={14}/></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [view, setView] = useState('dashboard');
  const [loc, setLoc] = useState({ stateAbbr:null, cityIdx:null });
  const [prospects, setProspects] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [prefill, setPrefill] = useState(null);
  const [toast, setToast] = useState('');
  const [user, setUser] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(()=>{
    (async ()=>{
      try{
        const uRes = {value: localStorage.getItem('sv_user')};
        if(uRes && uRes.value){
          const stored = JSON.parse(uRes.value);
          const u = { name:stored.name, agency:stored.agency, email:stored.email, hasSeenTutorial:stored.hasSeenTutorial||false };
          setUser(u);
          if(!u.hasSeenTutorial) setShowTutorial(true);
        }
      }catch(e){}
      try{
        const res = {value: localStorage.getItem('prospects')};
        if(res && res.value) setProspects(JSON.parse(res.value));
        else setProspects([seedProspect()]);
      }catch(e){ setProspects([seedProspect()]); }
      setLoaded(true);
    })();
  },[]);

  useEffect(()=>{
    if(!loaded) return;
    (async ()=>{ try{ localStorage.setItem('prospects', JSON.stringify(prospects)); }catch(e){} })();
  },[prospects, loaded]);

  function showToast(msg){ setToast(msg); setTimeout(()=>setToast(''), 3200); }

  async function handleAuth(u){
    setUser(u);
    if(!u.hasSeenTutorial) setShowTutorial(true);
  }
  async function completeTutorial(){
    setShowTutorial(false);
    const updated = { ...user, hasSeenTutorial:true };
    setUser(updated);
    try{
      const res = {value: localStorage.getItem('sv_user')};
      if(res){ const stored = JSON.parse(res.value); localStorage.setItem('sv_user', JSON.stringify({ ...stored, hasSeenTutorial:true })); }
    }catch(e){}
  }
  async function handleLogout(){
    setUser(null); setShowTutorial(false); setView('dashboard');
  }

  if(!loaded) return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mx-auto mb-3 animate-pulse"><Sun size={20} className="text-zinc-950"/></div>
        <div className="text-sm text-zinc-500">Loading SolarVault…</div>
      </div>
    </div>
  );
  if(!user) return <AuthView onAuth={handleAuth}/>;

  function createProspect(form){
    let resolved = { sunHours:5.0, consistentDays:210, bill:form.billMonthly, rate:0.15, netMetering:'partial' };
    const stMatch = STATES.find(s=>s.name.toLowerCase()===form.state.toLowerCase());
    if(stMatch){
      const cMatch = stMatch.cities.find(c=>c.name.toLowerCase()===form.city.toLowerCase());
      resolved = cMatch || stMatch;
    }
    const touFactor = stMatch ? getTouFactor(stMatch.abbr, form.plansBattery) : 1;
    const calc = estimateSolar({ sunHours:resolved.sunHours, bill:form.billMonthly, rate:resolved.rate, netMetering:resolved.netMetering }, { touFactor });
    const srec = stMatch ? getSrec(stMatch.abbr, calc.monthlyProd) : null;
    const id = 'p_'+Date.now();
    const base = { calc, name:form.name, address:form.address, city:form.city, state:form.state };
    const prospect = {
      id, name:form.name, email:form.email, phone:form.phone, address:form.address,
      state:form.state, city:form.city,
      sunHours:resolved.sunHours, consistentDays:resolved.consistentDays, billMonthly:form.billMonthly, rate:resolved.rate,
      roof:{ widthFt:form.roofWidth, depthFt:form.roofDepth, pitchDeg:form.roofPitch, azimuthDeg:form.roofAzimuth, shadingPct:form.shadingPct },
      stage:'Proposal Sent', createdAt:Date.now(), calc, srec, plansBattery:form.plansBattery, touFactor, leadSource:form.leadSource||'',
      documents:[
        { id:id+'_d1', type:'Proposal', status:'completed', body: docBody('Proposal', base) },
        { id:id+'_d2', type:'Service Agreement', status:'partially_signed', signatureAgent:null, signatureCustomer:null, body: docBody('Service Agreement', base) },
      ],
      equipmentOrders:[],
    };
    setProspects(ps=>[...ps, prospect]);
    setSelectedId(id);
    showToast(`Portfolio generated for ${form.name}`);
  }

  function placeOrder(prospectId, cart, total){
    setProspects(ps=>ps.map(p=>{
      if(p.id!==prospectId) return p;
      const orderId = 'ord_'+Date.now();
      const order = { id:orderId, items:cart, total, createdAt:Date.now() };
      const base = { calc:p.calc, name:p.name, address:p.address };
      const orderDoc = { id:orderId+'_doc', type:'Equipment Order Form', status:'completed', body:docBody('Equipment Order Form', base), items:cart, total };
      const installFee = 1500;
      const invoiceDoc = { id:orderId+'_inv', type:'Invoice', status:'sent', body:docBody('Invoice', base), items:[...cart, { name:'Installation service fee', qty:1, price:installFee }], total: total+installFee };
      return { ...p, equipmentOrders:[...p.equipmentOrders, order], documents:[...p.documents, orderDoc, invoiceDoc], stage:'Equipment Ordered' };
    }));
  }

  function updateDocSignature(prospectId, docId, role, dataUrl){
    setProspects(ps=>ps.map(p=>{
      if(p.id!==prospectId) return p;
      return { ...p, documents: p.documents.map(d=>{
        if(d.id!==docId) return d;
        const updated = { ...d, [role==='agent'?'signatureAgent':'signatureCustomer']: dataUrl };
        updated.status = updated.signatureAgent && updated.signatureCustomer ? 'executed' : 'partially_signed';
        return updated;
      })};
    }));
    showToast('Signature saved');
  }

  function updateStage(id, stage){ setProspects(ps=>ps.map(p=>p.id===id?{...p,stage}:p)); }
  function updateLeadSource(id, src){ setProspects(ps=>ps.map(p=>p.id===id?{...p,leadSource:src}:p)); }

  function togglePermitStep(prospectId, step){
    setProspects(ps=>ps.map(p=>{
      if(p.id!==prospectId) return p;
      const stepsNow = { ...(p.permit?.steps||{}) };
      stepsNow[step] = !stepsNow[step];
      return { ...p, permit:{ ...(p.permit||{}), steps:stepsNow } };
    }));
  }
  function updateHoa(prospectId, patch){
    setProspects(ps=>ps.map(p=> p.id!==prospectId ? p : ({ ...p, hoa:{ ...(p.hoa||{ required:false, status:'Not submitted' }), ...patch } })));
  }
  function generateHoaLetter(prospectId){
    setProspects(ps=>ps.map(p=>{
      if(p.id!==prospectId) return p;
      const docId = 'hoa_'+Date.now();
      const body = `HOA architectural review request for ${p.name} at ${p.address}. Proposed installation: ${fmtNum(p.calc.systemKw,2)} kW solar array using low-profile, black-frame panels mounted flush to the existing roof pitch with no alteration to the roofline. Many states have "solar access laws" that limit an HOA's discretion to deny a reasonably-sited solar installation outright — worth confirming ${p.state}'s specific statute as part of this submission.`;
      const doc = { id:docId, type:'HOA Approval Letter', status:'completed', body };
      const prevHoa = p.hoa || { required:true, status:'Not submitted' };
      const nextStatus = (prevHoa.status==='Approved'||prevHoa.status==='Denied') ? prevHoa.status : 'Submitted';
      return { ...p, documents:[...p.documents, doc], hoa:{ ...prevHoa, required:true, status:nextStatus } };
    }));
    showToast('HOA approval letter generated');
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {showTutorial && <TutorialOverlay user={user} onComplete={completeTutorial}/>}
      <header className="border-b border-zinc-800 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
            <Sun size={16} className="text-zinc-950"/>
          </div>
          <div>
            <div className="font-bold text-zinc-50 tracking-tight leading-none">SolarVault</div>
            <div className="text-[10px] text-zinc-500 leading-none">Agent Console</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-xs font-medium text-zinc-300">{user.name}</div>
            <div className="text-[10px] text-zinc-500">{user.agency}</div>
          </div>
          <button onClick={()=>setShowTutorial(true)} className="hidden md:flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-amber-400 transition px-2 py-1 rounded-lg hover:bg-zinc-800">
            <Sparkles size={11}/> Tour
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-200 transition px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 border border-zinc-800">
            <LogOut size={12}/> <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      </header>

      <nav className="flex-shrink-0 border-b border-zinc-800">
        <div className="flex gap-1 overflow-x-auto px-4 py-2">
          {NAV_GROUPS.map(g=>{
            const GIcon = g.icon;
            const isActive = g.items.includes(view);
            return (
              <button key={g.id} onClick={()=>setView(g.items[0])}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition font-medium ${isActive?'text-zinc-50':'text-zinc-500 hover:text-zinc-300'}`}
                style={isActive?{ background:g.color+'22', color:g.color, border:`1px solid ${g.color}44` }:{}}>
                <GIcon size={13}/> {g.label}
                {g.items.length>1 && <span className="text-[9px] opacity-50 ml-0.5">{g.items.length}</span>}
              </button>
            );
          })}
        </div>
        {(()=>{
          const activeGroup = NAV_GROUPS.find(g=>g.items.includes(view));
          if(!activeGroup || activeGroup.items.length<=1) return null;
          const items = activeGroup.items.map(id=>NAV_ALL.find(n=>n.id===id)).filter(Boolean);
          return (
            <div className="flex gap-1 overflow-x-auto px-4 py-1.5 border-t border-zinc-800/60">
              {items.map(item=>{
                const Icon = item.icon;
                const active = view===item.id;
                return (
                  <button key={item.id} onClick={()=>setView(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition ${active?'bg-amber-500 text-zinc-950 font-medium':'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'}`}>
                    <Icon size={11}/> {item.label}
                  </button>
                );
              })}
            </div>
          );
        })()}
      </nav>

      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
        {view==='dashboard' && <DashboardView prospects={prospects} setView={setView}/>}
        {view==='ratings' && <RatingsView loc={loc} setLoc={setLoc}/>}
        {view==='calculator' && <CalculatorView loc={loc} setLoc={setLoc} setView={setView} setProspectPrefill={setPrefill}/>}
        {view==='ev' && <EVView loc={loc} setLoc={setLoc}/>}
        {view==='rebates' && <RebateStackView loc={loc} setLoc={setLoc}/>}
        {view==='financing' && <FinancingView loc={loc} setLoc={setLoc}/>}
        {view==='lenders' && <LenderView/>}
        {view==='competitor' && <CompetitorComparatorView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId}/>}
        {view==='hoarights' && <HOARightsView loc={loc} setLoc={setLoc}/>}
        {view==='communitysolar' && <CommunitySolarView loc={loc} setLoc={setLoc} prospects={prospects} setView={setView}/>}
        {view==='billanalyzer' && <BillAnalyzerView setProspectPrefill={setPrefill} setView={setView} onToast={showToast}/>}
        {view==='copilot' && <CoPilotView/>}
        {view==='training' && <TrainingView/>}
        {view==='narrative' && <NarrativeView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onToast={showToast}/>}
        {view==='roof' && <RoofViewer/>}
        {view==='onboarding' && <OnboardingView prefill={prefill} onCreate={createProspect} setView={setView}/>}
        {view==='pipeline' && <PipelineView prospects={prospects} onUpdateStage={updateStage} onSelect={setSelectedId} setView={setView}/>}
        {view==='portfolio' && <PortfolioView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onToast={showToast} setView={setView}/>}
        {view==='export' && <ProposalExportView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onToast={showToast}/>}
        {view==='customerportal' && <CustomerPortalView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onToast={showToast}/>}
        {view==='referral' && <ReferralView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onToast={showToast}/>}
        {view==='storm' && <StormOutreachView prospects={prospects} onToast={showToast}/>}
        {view==='documents' && <DocumentsView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onUpdateDoc={updateDocSignature} onToast={showToast}/>}
        {view==='equipment' && <EquipmentView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onPlaceOrder={placeOrder} onToast={showToast}/>}
        {view==='permits' && <PermitHoaView prospects={prospects} selectedId={selectedId} setSelectedId={setSelectedId} onToggleStep={togglePermitStep} onUpdateHoa={updateHoa} onGenerateLetter={generateHoaLetter} setView={setView}/>}
        {view==='commission' && <CommissionView prospects={prospects}/>}
        {view==='leadsource' && <LeadSourceView prospects={prospects} onUpdateLeadSource={updateLeadSource}/>}
      </main>

      <Toast message={toast}/>
    </div>
  );
}
