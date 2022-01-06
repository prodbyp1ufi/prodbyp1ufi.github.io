var data = []
var groupLessonsData = []
var cabinets = []
async function loadingConfiguration(files){
    for (let i = 0; i < files.length; i++) {
        sheets = await readXlsxFile(files[i],{getSheets: true})
        findSheet =  sheets.find(sheet=> sheet.name.toLowerCase().includes('свод'))
        if(findSheet !== undefined){
            window.data.push( {
                file : files[i],
                sheet: findSheet.name
            })
        }
    }
    for (let i = 0; i < window.data.length; i++) {
        lessonsData = await readXlsxFile(window.data[i].file,{sheet: window.data[i].sheet})
        teachers = []
        for (let i = 0; i < lessonsData.length; i++) {
            for (let j = 0; j < lessonsData[0].length; j++) {
                if(lessonsData[i][j] !== null){
                    matches = /[А-Я][а-я]+\s[А-Я]\.\s?[А-Я]\.?/g.exec(lessonsData[i][j])
                    if( matches !== null){
                        if(teachers.some(teacher=> teacher.name === matches[0]) === false)
                        teachers.push(
                            { name : matches[0], lesson : [lessonsData[i][j+1] + ' ' + lessonsData[i][j+2]]}
                        )
                        else{
                            teacher = teachers.find(teacher=> teacher.name === matches[0])
                            teacher.lesson.push(
                                lessonsData[i][j+1] + ' ' + lessonsData[i][j+2]
                            )
                        }
                    }
                }
                
            }
            
        }
        window.groupLessonsData.push(
            {
                number: window.data[i].sheet.replace('свод','').replace('СВОД', '').replace(' ',''),
                lessons: teachers
            }
        )
    }
    cabinetButton = document.getElementById('cabinetButton')
    cabinetButton.removeAttribute('disabled')
    timeTableButton = document.getElementById('timeTableButton')
    timeTableButton.removeAttribute('disabled')
    generateTable()
}
function generateTable(){
    table = document.getElementById('sheetTable')
    dateInput = document.createElement('input')
    dateInput.type = 'date'
    dateInput.id = 'dateInput'
    dateInput.valueAsDate = new Date()
    tr = document.createElement('tr')
    td = document.createElement('td')
    td.appendChild(dateInput)
    tr.appendChild(td)
    window.groupLessonsData.forEach(groupData=>{
        td = document.createElement('td')
        td.innerHTML = groupData.number
        tr.appendChild(td)
    })
    table.appendChild(tr)
    for (let i = 0; i < 5; i++) {
        trCell = document.createElement('tr')
        tdCell = document.createElement('td')
        tdCell.innerHTML = i+1
        trCell.appendChild(tdCell)
        for (let j = 0; j < window.groupLessonsData.length; j++) {
            tdCell = document.createElement('td')
            tdCell.rowspan = 2
            tdCell.onclick=()=>{
                showModal([i,j],window.groupLessonsData[j])
            }
            trCell.appendChild(tdCell)
        }
        table.appendChild(trCell)
    }
}
var groupSeparation = ''
async function showModal(element,data){
    if(groupSeparation !== ''){
        let closeButton = document.getElementById("closeButton")
        closeButton.onclick = () =>{
            hiddenModal(element)
        }
    }
    let modalContainer = document.getElementsByClassName("modal-container")[0]
    modalContainer.style.visibility = 'visible'
    let teacherSelecter =  document.getElementsByClassName("teacher-select")[0]
    while (teacherSelecter.lastElementChild) {
        teacherSelecter.removeChild(teacherSelecter.lastElementChild);
    }
    option = document.createElement('option')
    option.selected = true
    option.disabled = true
    option.innerHTML = 'Преподаватель'
    teacherSelecter.appendChild(option)
    data.lessons.forEach(lesson=>{
        option = document.createElement('option')
        cabinet = cabinets.find(c=>c[0].split(' ')[0] === lesson.name.split(' ')[0])
        if(cabinet){
            option.innerHTML = lesson.name  + ' Каб.' + cabinet[1]
            option.value = lesson.name  + ' Каб.' + cabinet[1]
        }
        else{
            option.innerHTML = lesson.name
            option.value =  lesson.name
        }
        
        teacherSelecter.appendChild(option)
    })
    let disciplineSelecter = document.getElementsByClassName("discipline-select")[0]
    while (disciplineSelecter.firstChild) {
        disciplineSelecter.removeChild(disciplineSelecter.firstChild);
    }
    option.selected = true
    option.disabled = true
    option.innerHTML = 'Предмет'
    disciplineSelecter.appendChild(option)
    teacherSelecter.onchange = (e) => {
        try{
            while (disciplineSelecter.firstChild) {
                disciplineSelecter.removeChild(disciplineSelecter.firstChild);
            }
            teacherSearch = e.target.value.includes('Каб.') ? e.target.value.substring(0,e.target.value.indexOf(' Каб.')) : e.target.value
            disciplines = data.lessons.find(c=> c.name === teacherSearch)
            disciplines.lesson.forEach(teacherLesson=>{
                option = document.createElement('option')
                option.innerHTML = teacherLesson
                disciplineSelecter.appendChild(option)
            })
        }
        catch(error){
            let disciplineSelecter = document.getElementsByClassName("discipline-select")[0]
            option.selected = true
            option.disabled = true
            option.innerHTML = 'Предмет'
            disciplineSelecter.appendChild(option)
        }
    } 
    
    let saveButton = document.getElementById('saveButton')
    saveButton.onclick=()=>{
        let disciplineSelecter = document.getElementsByClassName("discipline-select")[0]
        let teacherSelecter =  document.getElementsByClassName("teacher-select")[0]
        let separationSelecter = document.getElementsByClassName("separation-select")[0]
        let table = document.getElementById('sheetTable')
        row = table.children[element[0]+1]
        cell = row.children.item(element[1]+1)
        separation = separationSelecter.value === 'Вся группа' ? '' : separationSelecter.value
        if(separation !== '' && groupSeparation === ''){
            groupSeparation = disciplineSelecter.value + '<br/>' + teacherSelecter.value + '<br/>' + separation
            alert('Выберите занятие для второй группы')
            showModal(element,data)
            return true
        }
        if(groupSeparation !== ''){
            cell.innerHTML = groupSeparation+ '<br/>' + '/'  + '<br/>' + disciplineSelecter.value + '<br/>' + teacherSelecter.value + '<br/>' + separation
            groupSeparation = ''
            hiddenModal()
        }
        else{
            cell.innerHTML = disciplineSelecter.value + '<br/>' + teacherSelecter.value + '<br/>' + separation
            groupSeparation = ''
            hiddenModal()
        }
        
        
    }
    let clearButton = document.getElementById('clearButton')
    clearButton.onclick=()=>{
        let table = document.getElementById('sheetTable')
        row = table.children[element[0]+1]
        cell = row.children.item(element[1]+1)
        cell.innerHTML = '' 
        hiddenModal()
    }
}

function hiddenModal(element){
    let modalContainer = document.getElementsByClassName("modal-container")[0]
    modalContainer.style.visibility = 'collapse'
    if(groupSeparation !== ''){
        if(element !== undefined){
            let table = document.getElementById('sheetTable')
            row = table.children[element[0]+1]
            cell = row.children.item(element[1]+1)
            cell.innerHTML = groupSeparation
            groupSeparation = ''
        }
    }
}


var days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];
var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
function exportToExcel(type, fn, dl){
    table = document.getElementById('sheetTable')
    thead = document.createElement('tr')

    td = document.createElement('td')
    inputData = document.getElementById('dateInput')
    var n = new Date(inputData.value).getDay();
    td.setAttribute('rowspan', 7)
    td.innerText = days[n]
    td.classList.add('tdDay')
    thead.appendChild(td)

    td = document.createElement('td')
    inputData = document.getElementById('dateInput')
    td.setAttribute('colspan', groupLessonsData.length+1)
    td.innerText = 'Расписание на ' + inputData.value.split('-')[2] + ' ' + months[new Date(inputData.value).getMonth()] + ' ' + inputData.value.split('-')[0] + 'г.'
    
    thead.appendChild(td)
    table.prepend(thead)
    var wb = XLSX.utils.table_to_book(table, {sheet:"расписание" ,raw : true});
    return dl ?
            XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
            XLSX.writeFile(wb, fn || ('sheet.' + (type || 'xlsx')   ));
    
    
}


async function loadingCabinet(files){
    cabinetData = await readXlsxFile(files[0])
    cabinetData.forEach(data=>{
        if(data.some(d=>d===null) === false){
            cabinets.push(data)
        }
    })
}


async function loadingTimeTable(files){
    timeTableData = await readXlsxFile(files[0])
    groupIndex = timeTableData.findIndex(data=> data.some(d=> /^[0-9][0-9][0-9][0-9]$/.exec(d) !== null) === true)
    for (let i = groupIndex+1; i < timeTableData.length; i++){
        for (let j = 0; j < timeTableData[groupIndex].length; j++) {
            if(timeTableData[i][j] !== null){
                element = [0,0]
                element[1] = window.groupLessonsData.findIndex(group=> group.number === timeTableData[groupIndex][j])
                if(element[1] !== -1){
                    element[1] += 1
                    element[0] = timeTableData[i].find(row=> /^[0-9]$/.exec(row) !== null)
                    if(element[0] !== undefined){
                        element[0] = parseInt(element[0])
                        let table = document.getElementById('sheetTable')
                        row = table.children[element[0]]
                        cell = row.children.item(element[1])
                        cell.innerHTML = timeTableData[i][j]
                    }
                    else{
                        continue
                    }
                }
                else{
                    continue
                }
                
            }
        }
    }
}