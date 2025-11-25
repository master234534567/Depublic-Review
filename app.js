const KEY = 'fancy_app_submissions_v2'
const PASSWORD = 'review123'  // reviewer password
const SHEETS_URL = "YOUR_WEB_APP_URL_HERE"; // paste your Apps Script URL

const el = x => document.querySelector(x)
let submissions = JSON.parse(localStorage.getItem(KEY) || '[]')

const list = el('#list')
const form = el('#submissionForm')
const title = el('#title')
const description = el('#description')
const link = el('#link')
const agree = el('#agree')
const error = el('#formError')
const search = el('#search')
const filter = el('#filter')
const modal = el('#modal')
const modalBody = el('#modalBody')
const modalClose = el('#modalClose')
const darkToggle = el('#darkToggle')
const exportBtn = el('#exportBtn')
const importFile = el('#importFile')

function uid(){return Math.random().toString(36).slice(2,9)}
function save(){localStorage.setItem(KEY,JSON.stringify(submissions))}
function humanDate(ts){return new Date(ts).toLocaleString()}
function makeBadge(status){const s=document.createElement('span');s.className='badge '+status;s.textContent=status;return s}

async function sendToSheets(item) {
  try {
    const res = await fetch(SHEETS_URL, {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" }
    });
    const result = await res.json();
    if (result.result !== "success") {
      console.error("Sheets error:", result);
    }
  } catch (err) {
    console.error("Failed to connect to Sheets:", err);
  }
}

function render(){
  list.innerHTML = ''
  const term = (search.value || '').toLowerCase()
  const f = filter
