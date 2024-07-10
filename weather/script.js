const API_URL = 'https://api.openweathermap.org'
const API_KEY = 'c0dbfa69e64d7efcbef72407c489d67b'
const mainCurrent = document.querySelector('#current_tab')
const mainForecast = document.querySelector('#forecast_tab')
const main404 = document.querySelector('#e404')
const headerCity = document.querySelector('header div h2')
const searchForm = document.forms.search
const headerBtns = document.querySelectorAll('#header_tabs button')
const currentDate = new Date()
let getData = (city) =>{
    fetch(`${API_URL}/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
        .then(res=>{
            console.log(res)
            if (res.status == 404){
                throw new Error(`error`)
            }
            mainCurrent.innerHTML = `
            <div id="current" class="bg-white p-4 mb-4">
            
            </div>
            <div id="hourly" class="bg-white p-4 mb-4 overflow-hidden">
                <h2 class="text-sky-500 text-l uppercase font-bold">Hourly</h2>
                <div id="hourly_content" class="flex justify-between p-4">
                    
                </div>
            </div>
            `
            mainForecast.innerHTML = `
            <div class="flex gap-[2px] mb-4" id="forecast_days">

            </div>
            <div id="forecast_hourly" class="bg-white p-4 mb-4 overflow-hidden">
                <h2 class="text-sky-500 text-l uppercase font-bold">Hourly</h2>
                <div id="forecast_hourly_content" class="flex justify-between p-4">
                    
                </div>
            </div>
            `
            return res.json()})
        .then(res=>{
            const current = document.querySelector('#current')
            console.log(res)
            headerCity.innerHTML = `Weather of ${city}`
            searchForm.input.value = city
            let sunrise = new Date(res.sys.sunrise*1000)
            let sunset = new Date(res.sys.sunset*1000)
            console.log(sunset.toLocaleString())
            let duration = Math.round((sunset-sunrise)/1000/60) 
            current.innerHTML = `
            <div id="current_info" class="flex justify-between">
                <h2 class="text-sky-500 text-l uppercase font-bold">Current Weather</h2>
                <h2 class="text-sky-500 text-l uppercase font-bold">
                    ${currentDate.getDate()}.${currentDate.getMonth()+1}.${currentDate.getFullYear()}
                </h2>
            </div>
            <div id="current_weather" class="flex justify-between px-10">
                <div id="current_condition" class="flex flex-col items-center">
                    <img src="https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png" alt="">
                    <p>${res.weather[0].main}</p>
                </div>
                <div id="current_value" class="flex flex-col justify-between pt-5">
                    <p class="text-6xl">${Math.round(res.main.temp)}°C</p>
                    <p>Feels like ${Math.round(res.main.feels_like)}°C</p>
                </div>
                <div id="current_length" class="grid gap-y-2 grid-cols-2 pt-7">
                    <div class="flex flex-col justify-between">
                        <p>Sunrise:</p>
                        <p>Sunset:</p>
                        <p>Duration:</p>
                    </div>
                    <div id="length_values" class="flex flex-col justify-between text-right">
                        <p>${sunrise.toLocaleTimeString()}</p>
                        <p>${sunset.toLocaleTimeString()}</p>
                        <p>${Math.round(duration/60)}:${
                            (duration-Math.round(duration/60)*60)<10
                            ?(duration-Math.round(duration/60)*60)<0?'00':'0'+`${duration-Math.round(duration/60)*60}`
                            :duration-Math.round(duration/60)*60
                        } hr</p>
                    </div>
                </div>
            </div>
            `
            fetch(`${API_URL}/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
                .then(res=>res.json())
                .then(res=>{
                    const forecastDays = document.querySelector('#forecast_days')
                    const forecastHourly = document.querySelector('#forecast_hourly_content')
                    const currentHourly = document.querySelector('#hourly_content')
                    console.log(res)
                    hourlyLoad(currentHourly)
                    currentHourly.innerHTML += res.list.slice(0, 6).map(hourlyComponent).join('')
                    let days = res.list.filter(e=>e.dt_txt.includes(res.list[0].dt_txt.split(' ')[1]))
                    forecastDays.innerHTML = days.map((e, index)=>dailyComponent(e, index)).join('');
                    [...forecastDays.children].forEach(el=>{
                        el.onclick = (e) =>{
                            [...forecastDays.children].forEach(el=>{
                                el.classList.remove('active')
                            })
                            if (!e.currentTarget.classList.contains('active')){
                            e.currentTarget.classList.add('active')
                            }
                            let active_dt = document.querySelector('.active span').innerHTML
                            let start = res.list.indexOf(res.list.filter(e=>e.dt==active_dt)[0])
                            hourlyLoad(forecastHourly)
                            hourlyLoadDays(forecastHourly, start)
                        }
                    })
                    hourlyLoad(forecastHourly)
                    let hourlyLoadDays = (el, index = 0) =>{
                        el.innerHTML += res.list.slice(index, index+6).map(hourlyComponent).join('')
                    }
                    hourlyLoadDays(forecastHourly)
                })
        })
        .catch(error =>{
            console.log(error)
            let html = `
            <div class="bg-white p-4 mb-4 text-gray-500 font-bold text-center text-xl">
                <img class="w-64 h-64 mx-auto" src="https://icon-icons.com/downloadimage.php?id=88213&root=1353/SVG/&file=if-word-18-2875628_88181.svg" alt="">
                <p>
                    ${city} could not be found.
                </p>
                <p>
                    Please enter a different location.
                </p>
            </div>
            `
            mainCurrent.innerHTML = html
            mainForecast.innerHTML = html
        })
}
let hourlyComponent = data =>{
    let hour = new Date(data.dt*1000).getHours()
    return `
    <div>
        <p>${hour>12?`${hour-12}pm`:`${hour}am`}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
        <p>${data.weather[0].main}</p>
        <P>${Math.round(data.main.temp)}°</P>
        <p>${Math.round(data.main.feels_like)}°</p>
        <p>${Math.round(data.wind.speed)} ESE</p>
    </div>
    `
}
let hourlyLoad = data =>{
    data.innerHTML = `
    <div id="hourly_info">
        <p>Today</p>
        <div class="h-[100px] w-[100px] bg-white"></div>
        <p class="text-gray-400">Forecast</p>
        <div class="h-px w-[92%] bg-gray-200 absolute"></div>
        <P class="text-gray-400">Temp (°C)</P>
        <div class="h-px w-[92%] bg-gray-200 absolute"></div>
        <p class="text-gray-400">Feels Like</p>
        <div class="h-px w-[92%] bg-gray-200 absolute"></div>
        <p class="text-gray-400">Wind (km/h)</p>
    </div>
    `
}
let dailyComponent = (data, index) =>{
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let date = new Date(data.dt*1000)
    return `
    <div class="flex flex-col justify-between p-6 bg-gray-300 cursor-pointer${index == 0?' active':''}">
        <p class="text-sky-500 uppercase font-bold">${index == 0?'Tonight':days[date.getDay()]}</p>
        <p class="text-gray-500 uppercase">${date.toDateString().split(' ').slice(1,3).join(' ')}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
        <p class="text-xl">${Math.round(data.main.temp)} °C</p>
        <p class="text-gray-500 capitalize">${data.weather[0].description}</p>
        <span class="hidden">${data.dt}</span>
    </div>
    `
}
headerBtns.forEach(el=>{
    el.onclick = e =>{
        headerBtns.forEach(el=>{
            el.disabled = !el.disabled
        })
        mainCurrent.classList.toggle('hidden')
        mainForecast.classList.toggle('hidden')
    }
})
searchForm.onsubmit = e =>{
    e.preventDefault()
    getData(e.target.input.value)
}
getData('Tashkent')
