const globals = {
    images: {
        logo: '/public/images/logo.png',
        hero: '/public/images/hero.jpg',
    },
    services: [
        {
            "name": "Nearby Hospitals",
            "image": "/public/images/service1.jpg",
            "url": "https://www.google.com/maps/search/pet+hospitals+near+me",
            target: '_blank',
            loginRequired: false,
        },
        {
            "name": "Doctors",
            "image": "/public/images/service2.jpg",
            "url": '/doctors',
            loginRequired: false,
        },
        {
            "name": "Rescue Service",
            "image": "/public/images/service3.jpg",
            "url": '/rescue', 
            loginRequired: true,           
        },
        {
            "name": "Shop",
            "image": "/public/images/service4.jpg",
            "url": '/shop',
            loginRequired: false,
        },
        {
            "name": "Adoptions",
            "image": "/public/images/service5.jpg",
            "url": '/adoption',
            loginRequired: true,
        },
        {
            "name": "Boarding",
            "image": "/public/images/service6.jpg",
            "url": '/boarding',
            loginRequired: false,
        },
        {
            "name": "Transportation",
            "image": "/public/images/service6.jpg",
            "url": '/transportation',
            loginRequired: false,
        }
    ],
    texts:{
        heroTexts: [
            'Pet',
            'Wellness',
            'Information',
            'Hub'
        ],
        
    },
    login:{
        paths: {
            login: '/api/login/',
            signup: '/api/signup/user/',
        },
        texts: {
            from: {
                login: "Don't have an account?",
                signup: 'Already have an account?',
            },
            signup: 'Sign Up',
            login: 'Login',
        },
        inputs: {
            login: {
                email: {
                    type: 'email',
                    text: 'Email',
                },
                password: {
                    type: 'password',
                    text: 'Password',
                },
                button:{
                    type: 'submit',
                    text: 'Login',
                }
            },
            signup: {
                name: {
                    type: 'text',
                    text: 'Name',
                },
                phone: {
                    type: 'text',
                    text: 'Phone',
                },
                email: {
                    type: 'email',
                    text: 'Email',
                },
                password: {
                    type: 'password',
                    text: 'Password',
                },
                image:{
                    type: 'file',
                    text: 'Image',
                },
                button:{
                    type: 'submit',
                    text: 'Sign Up',
                }
            },
        }
    },
    menus: [
        {
            name: 'HOME',
            url: '/',
            logggedIn: true,
            loggedOut: true,
        },
        {
            name: 'BLOG',
            url: '/blog',
            logggedIn: true,
            loggedOut: true,
        },
        {
            name: 'SERVICES',
            url: '/#allServices',
            logggedIn: true,
            loggedOut: true,
        },
        {
            name: "LOGIN",
            url: '/login',
            logggedIn: true,
            loggedOut: false,
        },
        {
            name: "PROFILE",
            url: '/profile',
            logggedIn: false,
            loggedOut: true,
        }
    ]
}
const dataLoads = {
    getData : async(path) => {
        console.log(path);
        const response = await fetch(`./api/${path}/`);
        const data = await response.json();
        return data;
    },
};
const functions = {
    isLoggedin: () => {
        const token = localStorage.getItem('token');
        if(token){
            return true;
        }else{
            return false;
        }
    },
};
const controllers = {
    notify: (type,message) => {
        let notify = document.getElementById('notify');
        if(notify){
            try{
                notify.remove();
            }catch(e){}
        }
        notify = document.createElement('div');
        notify.id = 'notify';
        notify.classList = type;
        notify.innerText = message;
        document.body.append(notify);
        setTimeout(()=>{
            try{
                notify.remove();
            }catch(e){}
        },3000);
    },
};

const components = {

    header: () => {
        const loggedIn = functions.isLoggedin();
        const header = document.createElement('div');
        header.id = 'header';
        const logo = document.createElement('img');
        logo.src = globals.images.logo;
        logo.classList = 'logo';
        const desktopMenus = document.createElement('div');
        desktopMenus.classList = 'desktopMenus';
        globals.menus.forEach(menu => {
            if(!((menu.logggedIn && !loggedIn) || (menu.loggedOut && loggedIn))){
                return;
            }
            const menuElement = document.createElement('a');
            menuElement.href = menu.url;
            menuElement.innerText = menu.name;
            menuElement.classList = 'menu';
            desktopMenus.append(menuElement);
            menuElement.onclick = async(e)=>{
                // if hash url dont prevent default
                if(!menu.url.includes('#')){
                    e.preventDefault();
                }
                window.history.pushState({},'',menu.url);
                await view();
            };
        });
        header.append(logo,desktopMenus);
        return header;
    },
    login: () => {
        let state ='login';
        const login = document.createElement('div');
        login.id = 'login';
        const loginText = document.createElement('div');
        loginText.classList = 'text';
        const loginTextTitle = document.createElement('div');
        loginTextTitle.classList = 'title';
        loginTextTitle.innerText = globals.login.texts[state];
        loginText.append(loginTextTitle);
        const loginForm = ()=>{
            const loginForm = document.createElement('form');
            loginForm.classList = 'form';
            const inputs = globals.login.inputs[state];
            for(let input in inputs){
                if(input!='button'){
                    const inputHolder = document.createElement('div');
                    inputHolder.classList = 'inputHolder';
                    const label = document.createElement('label');
                    label.innerText = inputs[input].text;
                    const inputElement = document.createElement('input');
                    inputElement.type = inputs[input].type;
                    inputElement.placeholder = inputs[input].text;
                    inputElement.name = input;
                    inputHolder.append(label,inputElement);
                    loginForm.append(inputHolder);
                }else{
                    const inputHolder = document.createElement('div');
                    inputHolder.classList = 'inputHolder';
                    const inputElement = document.createElement('input');
                    inputElement.type = inputs[input].type;
                    inputElement.value = inputs[input].text;
                    inputElement.classList = 'button';
                    inputHolder.append(inputElement);
                    loginForm.append(inputHolder);
                    inputElement.onclick = async(e)=>{
                        e.preventDefault();
                        const formData = new FormData(loginForm);
                        const response = await fetch(`${globals.login.paths[state]}`,{
                            method: 'POST',
                            headers: {},
                            body: formData
                        });
                        // status code
                        if(response.status==200){
                            const result = await response.json();
                            if(state=='login'){
                                localStorage.setItem('token',result.token);
                                localStorage.setItem('user',JSON.stringify(result.user));
                                window.history.pushState({},'',`/`);
                                await view();
                            }
                        }else{
                            const result = await response.json();
                            controllers.notify('danger',result.message||result.details||'Something went wrong');
                        }
                    };
                }
            }
            return loginForm;   
        }
        let loginFormElement = loginForm();
        
        const icons = () => {
            const iconsHolder = document.createElement('div');
            iconsHolder.classList = 'iconsHolder';
            const orHolder = document.createElement('div');
            orHolder.classList = 'orHolder';
            const or = document.createElement('span');
            or.classList = 'or';
            or.innerText = 'OR';
            orHolder.append(or);
            const icons = document.createElement('div');
            icons.classList = 'icons';
            const icon = [
                'fa fa-google',
                'fa fa-facebook',
                'fa fa-twitter',
            ];
            for(let i = 0; i<icon.length; i++){
                const iconHolder = document.createElement('div');
                iconHolder.classList = 'iconHolder';
                const iconElement = document.createElement('a');
                iconElement.classList = `${icon[i]} icon`;
                iconHolder.append(iconElement);
                icons.append(iconHolder);
            }
            iconsHolder.append(orHolder,icons);
            return iconsHolder;
        };
        const iconsElement = icons();

        const changeStateText = () => {
            const changeStateHolder = document.createElement('div');
            changeStateHolder.classList = 'changeStateHolder';
            const text = document.createElement('div');
            text.classList = 'text';
            const stateText = document.createElement('div');
            stateText.classList = 'stateText';
            stateText.innerText = globals.login.texts[state=='login'?'signup':'login'];
            text.innerText = globals.login.texts.from[state=='login'?'signup':'login'];
            changeStateHolder.append(text,stateText);
            stateText.onclick = async()=>{
                state = state=='login'?'signup':'login';
                console.log(state)
                loginTextTitle.innerText = globals.login.texts[state];
                let loginFormElementNew = loginForm(state)
                loginFormElement.replaceWith(loginFormElementNew);
                loginFormElement = loginFormElementNew;
                changeStateHolder.replaceWith(changeStateText(state));
            }
            return changeStateHolder;
        };
        const changeStateElement = changeStateText();
        login.append(loginText,loginFormElement,iconsElement,changeStateElement);
        return login;
    },
    vail: () => {
        const vail = document.createElement('div');
        vail.id = 'vail';
        return vail;
    },
    hero:()=>{
        const hero = document.createElement('div');
        hero.id = 'hero';
        const heroText = document.createElement('div');
        heroText.classList = 'text';
        heroText.style.backgroundImage = `url('${globals.images.hero}')`; 
        heroText.style.backgroundSize = 'cover';
        heroText.style.backgroundPosition = 'center';
        const w1 = document.createElement('span');
        w1.innerText = globals.texts.heroTexts[0];
        w1.classList = 'black';
        const w2 = document.createElement('span');
        w2.innerText = globals.texts.heroTexts[1];
        w2.classList = 'white';
        const br = document.createElement('br');

        const amberson = document.createElement('div');
        amberson.innerText = '&';
        amberson.classList = 'amberson';
        const w3 = document.createElement('span');
        w3.innerText = globals.texts.heroTexts[2];
        w3.classList = 'black';
        const w4 = document.createElement('span');
        w4.innerText = globals.texts.heroTexts[3];
        w4.classList = 'white';
        const heroTextContainer = document.createElement('div');
        heroTextContainer.classList = 'textContainer';
        heroTextContainer.append(w1,w2,br,amberson,w3,w4)
        heroText.append(heroTextContainer);
        
        const heroDescription = document.createElement('div');
        heroDescription.classList = 'description';

        const followus = document.createElement('div');
        const followusText = document.createElement('span');
        followusText.classList = 'title';
        followusText.innerText = 'FOLLOW US';
        const followusIcons = document.createElement('div');
        followusIcons.classList = 'followusIcons content';
        const icons = [
            'fa fa-instagram',
            'fa fa-google',
            'fa fa-facebook',
            'fa fa-twitter',
        ]
        for(let i = 0; i<icons.length; i++){
            const iconHolder = document.createElement('div');
            iconHolder.classList = 'circleIconHolder';
            const icon = document.createElement('a');
            icon.classList = `${icons[i]} circleIcon fa-inverse`;
            iconHolder.append(icon);
            followusIcons.append(iconHolder);
        }
        followus.append(followusText,followusIcons);



        const contacts = document.createElement('div');
        contacts.classList = 'contacts content';
        const contactsText = document.createElement('span');
        contactsText.classList = 'title';
        contactsText.innerText = 'CONTACTS';
        const phone = document.createElement('div');
        phone.classList = 'phone content';
        const phoneIcon = document.createElement('i');
        phoneIcon.classList = 'fa fa-phone';
        const phoneText = document.createElement('a');
        phoneText.innerText = ' +1 234 567 890';
        const email = document.createElement('div');
        email.classList = 'email';
        const emailIcon = document.createElement('i');
        emailIcon.classList = 'fa fa-envelope';
        const emailText = document.createElement('a');
        emailText.innerText = ' info@demolink.org';
        phone.append(phoneIcon,phoneText);
        email.append(emailIcon,emailText);
        contacts.append(contactsText,phone,email);



        const location = document.createElement('div');
        location.classList = 'location content';
        const locationText = document.createElement('span');
        locationText.classList = 'title';
        locationText.innerText = 'LOCATION';
        const address = document.createElement('div');
        address.classList = 'address content';
        const ddres1 = document.createElement('div');
        ddres1.innerText = '123 Street, City';
        const ddres2 = document.createElement('div');
        ddres2.innerText = 'State 12345';
        address.append(ddres1,ddres2);
        location.append(locationText,address);
        



        heroDescription.append(followus,contacts,location);
        hero.append(heroText,heroDescription);
        return hero;
    },
    services:()=>{
        const servicesholder = document.createElement('div');
        servicesholder.id = 'servicesholder';
        const services = document.createElement('div');
        services.id = 'services';
        // for
        const title = document.createElement('div');
        title.classList = 'title';
        title.innerText = 'SERVICES';
        servicesholder.append(title);

        title.id = 'allServices';
        // const
        for(let i = 0; i<globals.services.length; i++){
            const servicecard = document.createElement('div');
            servicecard.classList = 'servicecard';
            servicecard.style.backgroundImage = `url('${globals.services[i].image}')`;
            const servicecardText = document.createElement('div');
            servicecardText.classList = 'servicecardText';
            servicecardText.innerText = globals.services[i].name;
            servicecard.append(servicecardText);
            services.append(servicecard);
            servicecard.onclick = async()=>{
                // if(globals.services[i].loginRequired && functions.isLoggedin()){
                //     console.log('login required')
                //     controllers.notify('warning','Login Required');
                //     return;
                // }
                // // url blank target
                if(globals.services[i].target){
                    window.open(globals.services[i].url,globals.services[i].target);
                }else{
                    window.history.pushState({},'',globals.services[i].url);
                    await view();
                }
            };
        }
        servicesholder.append(services);
        return servicesholder;
    },
    footer:()=>{
        const footer = document.createElement('div');
        footer.id = 'footer';
        footer.innerText = '©Copyright | Pet Wellness Hub';
        return footer;
    },
    portfolioCard: (item) => {
        const porfolio = document.createElement('div');
        porfolio.classList = 'portfolio';
        const image = document.createElement('div');
        image.classList = 'image';
        image.style.backgroundImage = `url('${item.image}')`;
        image.style.backgroundSize = 'cover';
        image.style.backgroundPosition = 'center';
        
        const content = document.createElement('div');
        content.classList = 'content';
        const contact = document.createElement('div');
        contact.classList = 'contact';
        if(item.phone){
            const phone = document.createElement('div');
            phone.classList = 'item';
            const phoneIcon = document.createElement('a');
            phoneIcon.href = `tel:${item.phone}`;
            phoneIcon.classList = 'fa fa-phone';
            phone.append(phoneIcon);
            contact.append(phone);
        }
        if(item.email){
            const email = document.createElement('div');
            email.classList = 'item';
            const emailIcon = document.createElement('a');
            emailIcon.href = `mailto:${item.email}`;
            emailIcon.classList = 'fa fa-envelope';
            email.append(emailIcon);
            contact.append(email);
        }
        if(item.user_id){
            const user = document.createElement('div');
            user.classList = 'item';
            const userIcon = document.createElement('a');
            userIcon.href = `/user/${item.user_id}`;
            userIcon.classList = 'fa fa-user';
            user.onclick = async(e)=>{
                e.preventDefault();
                window.history.pushState({},'',userIcon.href);
                await view();
            };
            user.append(userIcon);
            contact.append(user);
        }
        if(item.website){
            const website = document.createElement('div');
            website.classList = 'item';
            const websiteIcon = document.createElement('a');
            websiteIcon.classList = 'fa fa-globe';
            website.onclick = ()=>{
                window.open(item.website, '_blank');
            }
            website.append(websiteIcon);
            contact.append(website);
        }
        if(item.map){
            const map = document.createElement('div');
            map.classList = 'item';
            const mapIcon = document.createElement('a');
            mapIcon.classList = 'fa fa-map-marker';
            map.append(mapIcon);
            map.onclick = ()=>{
                window.open(`https://www.google.com/maps/search/${item.map}`, '_blank');
            }
            contact.append(map);
        }
        content.append(contact);


        if(item.name || item.speciality || item.price || item.service){
            const title = document.createElement('div');
            title.classList = 'head';
            if(item.name){
                const name = document.createElement('div');
                name.classList = 'name';
                name.innerText = item.name;
                title.append(name);
            }
            if(item.specialty){
                const specialty = document.createElement('div');
                specialty.classList = 'subtitle';
                specialty.innerText = item.specialty;
                title.append(specialty);
            }
            if(item.price){
                const price = document.createElement('div');
                price.classList = 'subtitle';
                price.innerText = item.price;
                title.append(price);
            }
            if(item.service){
                const service = document.createElement('div');
                service.classList = 'subtitle';
                service.innerText = item.service;
                title.append(service);
            }
            content.append(title);
        }
        const body = document.createElement('div');
        body.classList = 'body';
        if(item.hospital){
            const hospital = document.createElement('div');
            hospital.classList = 'line';
            hospital.innerText = item.hospital;
            body.append(hospital);
        }
        if(item.location){
            const location = document.createElement('div');
            location.classList = 'line';
            location.innerText = item.location;
            body.append(location);
        }
        if(item.description){
            const description = document.createElement('div');
            description.classList = 'line';
            description.innerText = item.description;
            body.append(description);
        }
        if(item.company){
            const company = document.createElement('div');
            company.classList = 'line';
            company.innerText = item.company;
            body.append(company);
        }


        const infos = ['email','phone','website']
        for(let i = 0; i<infos.length; i++){
            if(item[infos[i]]){
                const info = document.createElement('div');
                info.classList = 'line';
                info.innerText = `${infos[i]}: ${item[infos[i]]}`;
                body.append(info);
            }
        }
        content.append(body);

        porfolio.append(image,content);
        return porfolio;
    },
    portfolioCards: async(path) => {
        const items = await dataLoads.getData(path);
        const portfolioholder = document.createElement('div');
        portfolioholder.id = 'portfolioholder';
        const portfolios = document.createElement('div');
        portfolios.id = 'portfolios';
        const title = document.createElement('div');
        title.classList = 'title';
        title.innerText = path;
        for(let i=0;i<items.length;i++){
            const portfolio = components.portfolioCard(items[i],i);
            portfolios.append(portfolio);
        }
        portfolioholder.append(title,portfolios);
        return portfolioholder;
    }
};

const pages = {
    home: async() => {
        const header = components.header();
        const vail = components.vail();
        const hero = components.hero();
        const services = components.services();
        const footer = components.footer();
        const test = document.createElement('div');
        test.innerHTML = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>';
        document.body.replaceChildren(header,hero,services,footer);
    },
    login: async() => {
        if(functions.isLoggedin()){
            window.history.pushState({},'',`/`);
            await view();
            return;
        }else{
            const header = components.header();
            const vail = components.vail();
            const login = components.login();
            const footer = components.footer();
            document.body.replaceChildren(header,login,footer);
        }
    },
    doctors: async() => {
        const header = components.header();
        const vail = components.vail();
        const cards = await components.portfolioCards('doctors');
        const footer = components.footer();
        document.body.replaceChildren(header,cards,footer);
    },
    boarding: async() => {
        const header = components.header();
        const vail = components.vail();
        const cards = await components.portfolioCards('boardings');
        const footer = components.footer();
        document.body.replaceChildren(header,cards,footer);
    },
    shop: async() => {
        const header = components.header();
        const vail = components.vail();
        const cards = await components.portfolioCards('shops');
        const footer = components.footer();
        document.body.replaceChildren(header,cards,footer);
    },
    transportation: async() => {
        const header = components.header();
        const vail = components.vail();
        const cards = await components.portfolioCards('transportations');
        const footer = components.footer();
        document.body.replaceChildren(header,cards,footer);
    },
    adoption: async() => {
        const header = components.header();
        const vail = components.vail();
        const footer = components.footer();
        document.body.replaceChildren(header,footer);
    },
    rescue: async() => {
        const header = components.header();
        const vail = components.vail();
        const cards = await components.portfolioCards('rescues');
        const footer = components.footer();
        document.body.replaceChildren(header,cards,footer);
    },
    notFound: async() => {
        const header = components.header();
        const vail = components.vail();
        const notFound = document.createElement('div');
        notFound.id = 'notFound';
        notFound.innerText = '404 Page Not Found';
        const backToHome = document.createElement('a');
        backToHome.href = '/';
        backToHome.innerText = 'Back to Home';
        const footer = components.footer();
        document.body.replaceChildren(header,notFound,backToHome,footer);
    },
}
const view = async() => {
    const url = new URL(window.location.href);
    const path = url.pathname;
    if(path=='/'){
        await pages.home();
    }else if(path=='/doctors'){
        await pages.doctors();
    }else if(path=='/login'){
        await pages.login();
    }else if(path=='/boarding'){
        await pages.boarding();
    }else if(path=='/shop'){
        await pages.shop();
    }else if(path=='/transportation'){
        await pages.transportation();
    }else if(path=='/adoption'){
        await pages.adoption();
    }else if(path=='/rescue'){
        await pages.rescue();
    }else{
        await pages.notFound();
    }
}
(async()=>{
    await view();
    window.onpopstate = async()=>{
        await view();
    }
})();
