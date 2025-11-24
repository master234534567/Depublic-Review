const KEY = 'fancy_app_submissions_v2'
const PASSWORD = 'review123'  // reviewer password
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

function render(){
  list.innerHTML = ''
  const term = (search.value || '').toLowerCase()
  const f = filter.value
  const items = submissions.filter(it=>f==='all'?true:it.status===f)
    .filter(it=>!term||it.title.toLowerCase().includes(term)||it.description.toLowerCase().includes(term)||(it.link||'').toLowerCase().includes(term))
  if(items.length===0){const c=document.createElement('div');c.className='card';c.textContent='No submissions yet';list.appendChild(c);return}
  items.forEach(it=>{
    const row=document.createElement('div');row.className='card-entry'
    const left=document.createElement('div');left.className='entry-left'
    const h=document.createElement('div');h.className='entry-title';h.textContent=it.title
    const meta=document.createElement('div');meta.className='entry-meta';meta.textContent=it.description
    const when=document.createElement('div');when.className='entry-meta';when.textContent=humanDate(it.createdAt)
    left.appendChild(h);left.appendChild(meta);left.appendChild(when)
    if(it.link){const a=document.createElement('a');a.href=it.link;a.target='_blank';a.textContent='Open link';a.style.display='block';a.style.marginTop='6px';left.appendChild(a)}
    const right=document.createElement('div');right.className='entry-actions'
    const bView=document.createElement('button');bView.className='small-btn primary';bView.textContent='Details';bView.onclick=()=>openModal(it.id)
    const bMark=document.createElement('button');bMark.className='small-btn';bMark.textContent='Mark as Seen';bMark.onclick=()=>updateStatus(it.id,'reviewed')
    const bSend=document.createElement('button');bSend.className='small-btn warn';bSend.textContent='Send';bSend.onclick=()=>updateStatus(it.id,'sent')
    const bAccept=document.createElement('button');bAccept.className='small-btn';bAccept.textContent='Accept';bAccept.onclick=()=>updateStatus(it.id,'accepted')
    const bDel=document.createElement('button');bDel.className='small-btn';bDel.textContent='Delete';bDel.onclick=()=>deleteItem(it.id)
    right.appendChild(bView);right.appendChild(bMark);right.appendChild(bSend);right.appendChild(bAccept);right.appendChild(bDel)
    row.appendChild(left);row.appendChild(right)
    const badge = makeBadge(it.status)
    row.insertBefore(badge,row.firstChild)
    list.appendChild(row)
  })
}

// Just show details, drop rating/notes functionality
function openModal(id){
  const password = prompt("Enter password to view details:")
  if(password !== PASSWORD) return alert("Incorrect password")
  const it = submissions.find(s=>s.id===id);if(!it)return
  modalBody.innerHTML=''
  const wrap=document.createElement('div')
  const title=document.createElement('h2');title.textContent=it.title
  const p=document.createElement('p');p.textContent=it.description
  const info=document.createElement('div');info.className='entry-meta';info.textContent='Status: '+it.status+' · '+humanDate(it.createdAt)
  const linkEl=document.createElement('div');if(it.link){const a=document.createElement('a');a.href=it.link;a.target='_blank';a.textContent='Open link';linkEl.appendChild(a)}
  wrap.appendChild(title);wrap.appendChild(info);wrap.appendChild(p);wrap.appendChild(linkEl)
  modalBody.appendChild(wrap)
  modal.classList.add('show')
}

function closeModal(){modal.classList.remove('show');modalBody.innerHTML=''}
modalClose.onclick=closeModal
modal.onclick=(e)=>{if(e.target===modal)closeModal()}
function updateStatus(id,status){submissions = submissions.map(s=> s.id===id ? Object.assign({},s,{status}) : s);save();render()}
function deleteItem(id){submissions = submissions.filter(s=>s.id!==id);save();render()}

form.onsubmit=function(e){e.preventDefault();error.textContent=''
  const t=title.value.trim();const d=description.value.trim();const l=link.value.trim();const a=agree.checked
  if(!t||!d){error.textContent='Title and description required';return}
  if(!a){error.textContent='You must accept the rules';return}
  const item={id:uid(),title:t,description:d,link:l,status:'pending',createdAt:Date.now()}
  submissions.unshift(item);save();render();form.reset()
}

el('#clearBtn').onclick=()=>{form.reset();error.textContent=''}
search.oninput=render
filter.onchange=render

darkToggle.onchange = ()=>{document.documentElement.dataset.theme = darkToggle.checked ? 'dark' : 'light'}

exportBtn.onclick = ()=>{
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions))
  const a=document.createElement('a');a.href=dataStr;a.download='submissions.json';a.click()
}

importFile.onchange = (e)=>{
  const file = e.target.files[0]
  if(!file) return
  const reader = new FileReader()
  reader.onload = function(){submissions = JSON.parse(reader.result);save();render()}
  reader.readAsText(file)
}

render()
