let books = JSON.parse(localStorage.getItem('books')) || []
let visitors = JSON.parse(localStorage.getItem('visitors')) || []
let cards = JSON.parse(localStorage.getItem('cards')) || []
let save = _ =>{
    localStorage.setItem('books', JSON.stringify(books))
    localStorage.setItem('visitors', JSON.stringify(visitors))
    localStorage.setItem('cards', JSON.stringify(cards))
}
class Book{
    constructor(title, author, year, publisher, pages, amount){
        this.id = 0+books.length
        this.title = title
        this.author = author
        this.year = year
        this.publisher = publisher
        this.pages = pages
        this.amount = amount
        this.edit = `<div class="flex justify-center gap-3">
                        <img id="edit" onclick='loadModal("Edit", id=${this.id})' src="https://www.clipartmax.com/png/full/239-2396337_%C2%A0-note-and-pencil-png.png" alt="" class="w-5 h-5 cursor-pointer">
                        <img id="delete" onclick='deleteObj(${this.id})' src="https://pic.onlinewebfonts.com/thumbnails/icons_119829.svg" alt="" class="w-5 h-5 cursor-pointer">
                    </div>`
    }
    toString(){
        return this.title
    }
}
class Visitor{
    constructor(name, phone){
        this.id = 0+visitors.length
        this.name = name
        this.phone = phone
        this.edit = `<div class="flex justify-center gap-3">
                        <img id="edit" onclick='loadModal("Edit", id=${this.id})' src="https://www.clipartmax.com/png/full/239-2396337_%C2%A0-note-and-pencil-png.png" alt="" class="w-5 h-5 cursor-pointer">
                        <img id="delete" onclick='deleteObj(${this.id})' src="https://pic.onlinewebfonts.com/thumbnails/icons_119829.svg" alt="" class="w-5 h-5 cursor-pointer">
                    </div>`
    }
    toString(){
        return this.name
    }
}
class Card{
    constructor(book, visitor){
        this.id = 0+cards.length
        this.book = book
        this.visitor = visitor
        this.taken = new Date().toDateString()
        this.returned = `<img id="return" onclick='returnBook(${this.id})' src="https://www.svgrepo.com/show/114939/go-back-arrow.svg" alt="" class="w-5 h-5 cursor-pointer mx-auto">`
        this.edit = `<div class="flex justify-center gap-3">
                        <img id="edit" onclick='loadModal("Edit", id=${this.id})' src="https://www.clipartmax.com/png/full/239-2396337_%C2%A0-note-and-pencil-png.png" alt="" class="w-5 h-5 cursor-pointer">
                        <img id="delete" onclick='deleteObj(${this.id})' src="https://pic.onlinewebfonts.com/thumbnails/icons_119829.svg" alt="" class="w-5 h-5 cursor-pointer">
                    </div>`
    }
}
let exBook = new Book('test', 'test', 2001, 'test', 500, 10)
let exVisitor = new Visitor('test', 'test')
let exCard = new Card(exBook, exVisitor)
let activeTab = 'Books'
const headerBtns = document.querySelectorAll('#header_tabs button')
const main = document.querySelector('main')
let tabObj = {Books:exBook, Visitors:exVisitor, Cards:exCard}
let tabList = {Books:books, Visitors:visitors, Cards:cards}
let loadPage = _ =>{
    main.innerHTML = `
        <div id="main-head" class="flex justify-between mb-4">
            <p class="text-sky-500 text-xl uppercase font-bold">All ${activeTab}</p>
            <button class="p-1" onclick="loadModal('Create')">New ${activeTab.substring(0, activeTab.length-1)}</button>
        </div>
        <div class="h-[2px] bg-gray-200 w-full mb-4"></div>
        <div id="main-filter" class="flex justify-between mb-4">
            <form action="" name="sort">
                <label>Sort by:</label>
                <select name="select" id="" class="border-solid rounded border-[1px] border-gray-600 p-1">

                </select>
                <button class="p-1">Sort</button>
            </form>
            <form action="" name="search">
                <label>Search:</label>
                <input type="text" class="p-1" name='input'>
                <button class="p-1">Search</button>
            </form>
        </div>
        <table class="w-full mb-4">
            <thead>
                <tr id='table-head'>

                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    `
    const sortSelect = document.querySelector('#main-filter select')
    const table = document.querySelector('tbody')
    const tableHead = document.querySelector('#table-head')
    for (let key in tabObj[activeTab]){
        sortSelect.innerHTML += key=='edit'?'':`
            <option value="${key}">${key == 'id'?key.toUpperCase():key.substring(0,1).toUpperCase()+key.substring(1,key.length)}</option>
        `
        tableHead.innerHTML += `
            <th scope="col" id='${activeTab.toLowerCase()}-${key}'>${key == 'id'?key.toUpperCase():key.substring(0,1).toUpperCase()+key.substring(1,key.length)}</th>
        `
    }
    let tableContent = ``
    for (let object in tabList[activeTab]){
        tableContent += `
            <tr>
        `
        for (let key in tabList[activeTab][object]){
            key = tabList[activeTab][object][key]
            tableContent += `
                <td class=${typeof key == 'string'?key.includes('<img')?'':'pl-4':'pl-4'}>${typeof key == 'object'?key.name||key.title:key}</td>
            `
        }
        tableContent += `
            </tr>
        `
    }
    table.innerHTML = tableContent
    document.forms.sort.onsubmit = e =>{
        e.preventDefault()
        if (typeof tabObj[activeTab][e.target.select.value] == 'number'){
        tabList[activeTab].sort((a,b)=>a[e.target.select.value] - b[e.target.select.value])
        }else{
        tabList[activeTab].sort((a,b)=>{
            if (a[e.target.select.value].toLowerCase() < b[e.target.select.value].toLowerCase()) {
              return -1;
            }
            if (a[e.target.select.value].toLowerCase() > b[e.target.select.value].toLowerCase()) {
              return 1;
            }
            return 0;
          });
        }
        loadPage()
    }
    document.forms.search.onsubmit = e =>{
        e.preventDefault()
        tabList = {Books:books, Visitors:visitors, Cards:cards}
        tabList[activeTab] = tabList[activeTab].filter(el => {
            for (let key in el){
                if (`${el[key]}`.includes(e.target.input.value)&&!`${el[key]}`.includes('<img')){
                    return el
                }
            }
        })
        loadPage()
    }
}
loadPage()
let loadStats = _ =>{
    let bookstats = books
    bookstats.sort((a,b)=>{
        let counterA = 0
        let counterB = 0
        for (let card in cards){
            if (cards[card].book.id == a.id)
                counterA++
        }
        for (let card in cards){
            if (cards[card].book.id == b.id)
                counterB++
        }
        return counterB - counterA
    })
    let visitorstats = visitors
    visitorstats.sort((a,b)=>{
        let counterA = 0
        let counterB = 0
        for (let card in cards){
            if (cards[card].visitor.id == a.id)
                counterA++
        }
        for (let card in cards){
            if (cards[card].visitor.id == b.id)
                counterB++
        }
        return counterB - counterA
    })
    bookstats = bookstats.slice(0,5)
    visitorstats = visitorstats.slice(0,5)
    let dict = {0:bookstats, 1:visitorstats}
    let dict2 = {0:'books', 1:'visitors'}
    main.innerHTML = `
    <p class="text-sky-500 text-xl uppercase font-bold mb-4">5 most popular books</p>
    <div class="h-[2px] bg-gray-200 w-full mb-4"></div>
    <table class="w-full mb-4">
        
    </table>
    <p class="text-sky-500 text-xl uppercase font-bold mb-4">5 most active visitors</p>
    <div class="h-[2px] bg-gray-200 w-full mb-4"></div>
    <table class="w-full mb-4">
        
    </table>
    `
    const tables = document.querySelectorAll('table')
    tables.forEach((el, index)=>{
        let tableContent = ``
        tableContent +=`
        <thead>
            <tr id='table-head'>
        `
        for (let key in dict[index][0]){
            tableContent += `
                <th scope="col" id='${dict2[index]}-${key}'>${key == 'id'?key.toUpperCase():key.substring(0,1).toUpperCase()+key.substring(1,key.length)}</th>
            `
        }
        tableContent +=`
            </tr>
        </thead>
        <tbody>
        `
        console.log(tableContent)
        for (let object in dict[index]){
            tableContent += `
                <tr>
            `
            for (let key in dict[index][object]){
                key = dict[index][object][key]
                tableContent += `
                    <td class=${typeof key == 'string'?key.includes('<img')?'':'pl-4':'pl-4'}>${typeof key == 'object'?key.name||key.title:key}</td>
                `
            }
            tableContent += `
                </tr>
            `
        }
        el.innerHTML = tableContent
    })
}
const modal = document.querySelector('#modal')
const modalBg = document.querySelector('#modal-bg')
const modalForm = document.forms.modal_form
headerBtns.forEach(el=>{
    el.onclick = e =>{
        headerBtns.forEach(el=>{
            if (el.disabled) el.disabled = !el.disabled
        })
        e.currentTarget.disabled = !e.currentTarget.disabled
        activeTab = e.currentTarget.innerHTML
        if (activeTab == 'Statistics')
            loadStats()
        else
        loadPage()
    }
})
let showModal = _ =>{
    modal.classList.toggle('hidden')
    modal.classList.toggle('flex')
}
modalBg.onclick = showModal
let modalCreate = _ =>{
    if (activeTab == 'Books'){
        books.push(new Book(modalForm.title.value, modalForm.author.value, modalForm.year.value, modalForm.publisher.value, modalForm.pages.value, modalForm.amount.value))
    }else if (activeTab == 'Visitors'){
        visitors.push(new Visitor(modalForm.name.value, modalForm.phone.value))
    }else if (activeTab == 'Cards'){
        cards.push(new Card(books[modalForm.book.value], visitors[modalForm.visitor.value]))
    }
    save()
    loadPage()
}
let loadModal = (action, id=1) => {
    modalForm.innerHTML = `
    <p class="text-xl">${action} ${activeTab.substring(0, activeTab.length-1)}:</p>
    `
    if (activeTab == 'Cards'){
        let selectObj = ``
        for (let key in tabObj[activeTab]){
            selectObj += (key == 'id')||(key == 'edit')||(key == 'taken')||(key == 'returned')?'':`
            <label for='select-${key}'>${key.substring(0,1).toUpperCase()+key.substring(1,key.length)}</label>
            <select name="${key}" id="select-${key}" class="border-solid rounded border-[1px] border-gray-600 p-1">
            `
            for (let object in tabList[key.substring(0,1).toUpperCase()+key.substring(1,key.length)+'s']){
                object = tabList[key.substring(0,1).toUpperCase()+key.substring(1,key.length)+'s'][object]
                selectObj += `
                <option value="${object.id}">${object.name || object.title}</option>
                `
            }
            selectObj += (key == 'id')||(key == 'edit')?'':`
            </select>
            `
        }
        modalForm.innerHTML += selectObj
    }else{
        for (let key in tabObj[activeTab]){
            modalForm.innerHTML += (key == 'id')||(key == 'edit')?'':`
            <label for='input-${key}'>${key.substring(0,1).toUpperCase()+key.substring(1,key.length)}</label>
            <input id='input-${key}' type="text" name='${key}'>
            `
        }
    }
    modalForm.innerHTML += `
    <button>Save</button>
    `
    let formFields = document.querySelectorAll('#modal form input')
    formFields.forEach(el=>{
        if ((el.getAttribute('name') == 'year') || (el.getAttribute("name") == 'pages') || (el.getAttribute("name") == 'amount')){
            el.setAttribute('type', 'number')
        }
    })
    if (action == 'Create'){
        modalForm.onsubmit = e =>{
            e.preventDefault()
            modalCreate()
        }
    }else if (action == 'Edit'){
        let object = tabList[activeTab][id]
        formFields.forEach(el=>{
            el.value = object[el.getAttribute('name')]
        })
        modalForm.onsubmit = e =>{
            e.preventDefault()
            formFields.forEach(el=>{
                object[el.getAttribute('name')] = el.value
            })
            save()
            loadPage()
            showModal()
        }
    }
    showModal()
}
let returnBook = id =>{
    cards[id].returned = new Date().toDateString()
    save()
    loadPage()
}
let deleteObj = id =>{
    delete tabList[activeTab][id]
    console.log(tabList[activeTab])
    save()
    loadPage()
}
