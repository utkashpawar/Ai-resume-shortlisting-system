let uploadedResume = ""

document.getElementById("resumeFile").addEventListener("change",function(){

let file = this.files[0]

if(file){

let reader = new FileReader()

reader.onload=function(e){

uploadedResume = e.target.result
document.getElementById("resume").value = uploadedResume

}

reader.readAsText(file)

}

})

function analyze(){

let resume = document.getElementById("resume").value.toLowerCase()
let job = document.getElementById("job").value.toLowerCase()

let skills=[
"html","css","javascript","react","angular","vue",
"node","express","python","java","c","c++",
"sql","mysql","mongodb","docker","aws","git",
"machine learning","data science"
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

let score=0

if(required.length>0){
score=Math.round((matched.length/required.length)*100)
}

document.getElementById("bar").style.width=score+"%"
document.getElementById("bar").innerText=score+"%"

let output="Match Score: "+score+"%\n\n"

output+="Required Skills:\n"
required.forEach(s=>output+=s+"\n")

output+="\nMatched Skills:\n"
matched.forEach(s=>output+=s+"\n")

output+="\nMissing Skills:\n"
missing.forEach(s=>output+=s+"\n")

output+="\nRecommended Skills:\n"
missing.forEach(s=>output+=s+"\n")

document.getElementById("result").innerText=output

}

function openGemini(){

let resumeText=document.getElementById("resume").value
let jobText=document.getElementById("job").value

let prompt=`
Analyze this resume against the job description.

Resume:
${resumeText}

Job Description:
${jobText}

Give:
Match Score
Matched Skills
Missing Skills
Suggestions
`

navigator.clipboard.writeText(prompt)

alert("Prompt copied! Gemini will open. Press Ctrl+V in Gemini.")

window.open("https://gemini.google.com/app","_blank")

}
