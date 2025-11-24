const KEY = 'fancy_app_submissions_v1'
const el = x=>document.querySelector(x)
const q = x=>document.querySelectorAll(x)
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


function uid(){return Math.random().toString(36).slice(2,9)}
function save(){localStorage.setItem(KEY,JSON.stringify(submissions))}
function humanDate(ts){return new Date(ts).toLocaleString()}


function makeBadge(status){const s = document.createElement('span');s.className = 'badge ' + status; s.textContent = status; return s}


function render(){list.innerHTML = ''
const term = (search.value || '').toLowerCase()
const f = filter.value
const items = submissions.filter(it=> f==='all' ? true : it.status===f).filter(it=>{
if(!term) return true
return it.title.toLowerCase().includes(term) || it.description.toLowerCase().includes(term) || (it.link||'').toLowerCase().includes(term)
})
if(items.length===0){const c = document.createElement('div');c.className='card';c.textContent='No submissions yet';list.appendChild(c);return}
items.forEach(it=>{
const row = document.createElement('div');row.className='card-entry'
const left = document.createElement('div');left.className='entry-left'
const h = document.createElement('div');h.className='entry-title';h.textContent = it.title
const meta = document.createElement('div');meta.className='entry-meta';meta.textContent = it.description
const when = document.createElement('div');when.className='entry-meta';when.textContent = humanDate(it.createdAt)
left.appendChild(h);left.appendChild(meta);if(it.link){const a = document.createElement('a');a.href=it.link;a.target='_blank';a.textContent='Open link';a.style.display='block';a.style.marginTop='6px';left.appendChild(a)}
const right = document.createElement('div');right.className='entry-actions'
const bReview = document.createElement('button');bReview.className='small-btn primary';bReview.textContent='Review';bReview.onclick = ()=>openModal(it.id)
const bMark = document.createElement('button');bMark.className='small-btn';bMark.textContent='Mark Reviewed';bMark.onclick = ()=>updateStatus(it.id,'reviewed')
const bSend = document.createElement('button');bSend.className='small-btn warn';bSend.textContent='Send On';bSend.onclick = ()=>updateStatus(it.id,'sent')
const bAccept = document.createElement('button');bAccept.className='small-btn';bAccept.textContent='Accept';bAccept.onclick = ()=>updateStatus(it.id,'accepted')
const bDel = document.createElement('button');bDel.className='small-btn';bDel.textContent='Delete';bDel.onclick = ()=>deleteItem(it.id)
right.appendChild(bReview);right.appendChild(bMark);right.appendChild(bSend);right.appendChild(bAccept);right.appendChild(bDel)
row.appendChild(left);row.appendChild(right)
const badge = makeBadge(it.status)
row.insertBefore(badge,row.firstChild)
list.appendChild(row)
})
}


function openModal(id){const it = submissions.find(s=>s.id===id);if(!it)return
modalBody.innerHTML = ''
const wrap = document.createElement('div')
const title = document.createElement('h2');title.textContent = it.title
const p = document.createElement('p');p.textContent = it.description
const info = document.createElement('div');info.className='entry-meta';info.textContent = 'Status: ' + it.status + ' · ' + humanDate(it.createdAt)
const linkEl = document.createElement('div');if(it.link){const a=document.createElement('a');a.href=it.link;a.target='_blank';a.textContent='Open link';linkEl.appendChild(a)}
const hr = document.createElement('hr');hr.style.border='none'
