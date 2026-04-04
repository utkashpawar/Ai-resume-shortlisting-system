let uploadedResume = ""

// ---------------- AUTH ----------------

function register(){
let user=document.getElementById("username").value
let pass=document.getElementById("password").value

if(!user || !pass){
alert("Enter username & password")
return
}

localStorage.setItem(user,pass)
alert("Registered successfully!")
}

function login(){
let user=document.getElementById("username").value
let pass=document.getElementById("password").value

let stored=localStorage.getItem(user)

if(stored===pass){
localStorage.setItem("loggedIn",user)

document.getElementById("authSection").classList.add("hidden")
document.getElementById("appSection").classList.remove("hidden")
}else{
alert("Invalid login")
}
}

function logout(){
localStorage.removeItem("loggedIn")
location.reload()
}

window.onload=function(){
if(localStorage.getItem("loggedIn")){
document.getElementById("authSection").classList.add("hidden")
document.getElementById("appSection").classList.remove("hidden")
}
}

// ---------------- PDF UPLOAD ----------------

document.getElementById("resumeFile").addEventListener("change", async function(){

let file=this.files[0]

if(file){

let reader=new FileReader()

reader.onload=async function(){

let typedarray=new Uint8Array(reader.result)

let pdf=await pdfjsLib.getDocument(typedarray).promise

let text=""

for(let i=1;i<=pdf.numPages;i++){
let page=await pdf.getPage(i)
let content=await page.getTextContent()

content.items.forEach(item=>{
text+=item.str+" "
})
}

uploadedResume=text
document.getElementById("resume").value=text
}

reader.readAsArrayBuffer(file)
}
})

// ---------------- ANALYSIS ----------------

function analyze(){

if(!localStorage.getItem("loggedIn")){
alert("Please login first")
return
}

let resume=document.getElementById("resume").value.toLowerCase()
let job=document.getElementById("job").value.toLowerCase()

if(!resume || !job){
alert("Please fill both fields")
return
}

let skills=[
"html","css","javascript","react","angular","vue",
"node","express","python","java","c","c++",
"sql","mysql","mongodb","docker","aws","git",
"machine learning","data science","ai","nlp"
]

let required=[]
let matched=[]
let missing=[]

skills.forEach(skill=>{
if(job.includes(skill)){
required.push(skill)

if(resume.includes(skill)){
matched.push(skill)
}else{
missing.push(skill)
}
}
})

let score= required.length>0 
? Math.round((matched.length/required.length)*100)
: 0

// progress bar
let bar=document.getElementById("bar")
bar.style.width=score+"%"
bar.innerText=score+"%"

// decision logic
let level=""
let recommendation=""
let summary=""

if(score>=80){
level="Excellent Fit"
recommendation="Highly Recommended for Interview"
summary="Candidate strongly matches the job requirements and possesses most of the critical skills needed for this role."
}
else if(score>=60){
level="Good Fit"
recommendation="Recommended with minor improvements"
summary="Candidate meets most requirements but lacks a few important skills which can be improved."
}
else if(score>=40){
level="Average Fit"
recommendation="Consider if needed"
summary="Candidate partially matches the job requirements but has noticeable skill gaps."
}
else{
level="Low Fit"
recommendation="Not Recommended"
summary="Candidate does not meet the majority of required skills for this role."
}

// output (CLEAN UI CARDS)
let output=`

<div class="card">
<h3>Match Score: ${score}%</h3>
<p><b>Fit Level:</b> ${level}</p>
<p><b>Summary:</b><br>${summary}</p>
</div>

<div class="card">
<h4>Matched Skills</h4>
<p>${matched.length ? matched.join(", ") : "None"}</p>
</div>

<div class="card">
<h4>Missing Skills</h4>
<p>${missing.length ? missing.join(", ") : "None"}</p>
</div>

<div class="card">
<h4>Required Skills</h4>
<p>${required.length ? required.join(", ") : "None detected"}</p>
</div>

<div class="card">
<h4>Recommendations</h4>
<p>Focus on: <b>${missing.join(", ") || "No major gaps"}</b></p>
</div>

<div class="card">
<h4>Hiring Decision</h4>
<p><b>${recommendation}</b></p>
</div>

`

document.getElementById("result").innerHTML=output
}

// ---------------- GEMINI ----------------

function openGemini(){

let resumeText=document.getElementById("resume").value
let jobText=document.getElementById("job").value

if(!resumeText || !jobText){
alert("Please fill both fields")
return
}

let prompt=`
You are an AI HR Recruiter.

Analyze the candidate:

1. Match Score (%)
2. Strengths
3. Missing Skills
4. Detailed Explanation
5. Final Hiring Decision

Resume:
${resumeText}

Job Description:
${jobText}
`

navigator.clipboard.writeText(prompt)

alert("Prompt copied! Paste in Gemini (Ctrl+V)")

window.open("https://gemini.google.com/app","_blank")
}
