let cl = console.log;

/// posts => create object
//// GET=>dta get from dtatbase
////patch and put=>uppdate
//////delete
let cardcontrol = document.getElementById('card')
let postformcontrol = document.getElementById('postform');

let titlecontrol = document.getElementById('title');
let bodycontrol = document.getElementById('body');
let useridcontrol = document.getElementById('userid');
cl(useridcontrol)
let updatecontrol = document.getElementById('update');
let addbtn = document.getElementById('addbtn');
let loadercontrol = document.getElementById('loader');






let baseurl = `https://crud-application-f9285-default-rtdb.asia-southeast1.firebasedatabase.app/`
cl(baseurl)


let posturl = `${baseurl}/posts.json`
cl(posturl)


///2>configuration


// let xhr = new XMLHttpRequest();


// xhr2.open('GET', xhr);


// xhr2.send()

// let postarry = [];



const objtoarr = (obj) => {
	let postarr = [];
	for (const key in obj) {
		let obj2 = obj[key];
		obj2.id = key;
		postarr.push(obj2)
		// cl(obj2)
	}
	return postarr;
}
const updatehandler = (ele) => {
	let newobj = {
		title: titlecontrol.value,
		body: bodycontrol.value,
		userid: useridcontrol.value,

	}
	let updateid2 = localStorage.getItem('get');
	cl(updateid2)
	let updateurl = `${baseurl}/posts/${updateid2}.json`

	makeapicall('PUT', updateurl, JSON.stringify(newobj))
		.then((res) => {
			cl(res);
			let dta2 = JSON.parse(res)
			let updatedid = document.getElementById(updateid2);
			cl(updatedid)
			let chil = [...updatedid.children];


			chil[0].innerHTML = `<h2>${dta2.title}</h2>`
			chil[1].innerHTML = `<p>${dta2.body}<p>`
			swal.fire({
				title: "Good job!",
				text: "post updated",
				icon: "success"
			  });
		})
		.catch((err) => {
			cl(err)
		})
		.finally(() => {
			updatecontrol.classList.add('d-none');
			addbtn.classList.remove('d-none')
			postformcontrol.reset();
		})

}
const ondelete = (ele) => {
	let deletid = ele.closest('.card').id;
	let deleteurl = `${baseurl}/posts/${deletid}.json`

	Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })
    // makeapicall('DELETE', deleteurl)
    //     .then((res) => {
    //         document.getElementById(deletid).remove();

    //     })
    .then((result) => {

        if (result.isConfirmed) {

            makeapicall('DELETE', deleteurl)
                .then((res) => {
                    document.getElementById(deletid).remove();

                })
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    })
		.catch((err) => {
			cl(err)
		})
		.finally(() => {
			postformcontrol.reset();
		})
}
const createcard = (eve) => {
	let card2 = document.createElement('div');
	cl(card2)
	card2.className = 'card mb-4 background';

	card2.id = eve.id;

	card2.innerHTML = `
	 <div class="card-header">
					<h1>
					   ${eve.title}
					</h1>
				</div>
				<div class="card-body">
					<p>
					${eve.body}
					 </p>
				</div>
				<div class="card-footer d-flex justify-content-between">
					<button class="btn btn-outline-secondary cl" onclick="onedit(this)"> edit</button>
					<button class="btn btn-outline-secondary cl"onclick="ondelete(this)"> delete</button>
				</div>
	 `

	cardcontrol.append(card2);




}
const onpostcreate = (ele) => {
	ele.preventDefault();
	let newpost = {
		title: titlecontrol.value,
		body: bodycontrol.value,
		userid: useridcontrol.value
	}
	cl(newpost)
	makeapicall('POST', posturl, JSON.stringify(newpost))
		.then((ele) => {
			cl(ele)
			let createid = JSON.parse(ele);
			cl(createid);
			newpost.id = createid.name;
			cl(newpost)
			createcard(newpost)
			swal.fire({
                title: "Good job!",
                text: "post created",
                icon: "success"
            });

		})
		.catch((err) => {
			cl(err)
		})
		.finally(()=>{
			postformcontrol.reset()
		})
}
const onedit = (ele) => {
	let editedid = ele.closest('.card').id;
	localStorage.setItem('get', editedid)
	let editurl = `${baseurl}/posts/${editedid}.json`
	makeapicall('GET', editurl)
		.then((res) => {
			let dta = JSON.parse(res);
			titlecontrol.value = dta.title,
				bodycontrol.value = dta.body,
				useridcontrol.value = dta.userId
			updatecontrol.classList.remove('d-none')
			addbtn.classList.add('d-none')


		})
		.catch((err) => {
			cl(err)
		})
			
}

const tempalting = (ele) => {

	ele.forEach(eve => {

		createcard(eve);



	});



}
// tempalting()
const makeapicall = (methodname, apiurl, bodymsg = null) => {
	loadercontrol.classList.remove('d-none')

	return new Promise((resolve, reject) => {

		let xhr = new XMLHttpRequest();

		xhr.open(methodname, apiurl);

		xhr.send(bodymsg);

		xhr.onload = () => {
			loadercontrol.classList.add('d-none')
			if (xhr.status >= 200 && xhr.status <= 299) {
				resolve(xhr.responseText);

			} else {
				reject(xhr.statusText);

			}

		}

		xhr.onerror = function () {
			loadercontrol.classList.add('d-none')


		}


	})



}

makeapicall('GET', posturl)
	.then((res) => {
		let data = JSON.parse(res);
		cl(data)
		let data2 = objtoarr(data);
		cl(data2)
		tempalting(data2);


	})
	.catch((err) => {
		cl(err)
	})





postformcontrol.addEventListener('submit', onpostcreate)
updatecontrol.addEventListener('click', updatehandler)