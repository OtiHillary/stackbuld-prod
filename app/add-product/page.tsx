'use client'
import { db } from '@/app/db'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type product = {
    id: number
    title: string
    description: string
    price: number
    image: string
    category: string
    rating: number
}

export default function Home(){
    const [ imageFile, setImageFile ] = useState<Blob>()
    let defaultProduct = {
        id: 0,
        title: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        rating: 4
    }
    const [ productData, setProductData ] = useState<product>(defaultProduct)
    const [addSuccess, setAddSuccess] = useState(false)
    const router = useRouter()

    function handleChange(event: { target: { name: string; value: any } }) {
        setProductData( (prev: any) => {
            if(event.target.name === "price"){
                return { ...prev, [event.target.name]: Number(event.target.value) }
            }
            return { ...prev, [event.target.name]: event.target.value }
        })
    }

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault()
        const formData = new FormData()
        if(!imageFile) return
        formData.append('image', imageFile)
        
        async function addId(data: { image: any; id: number; title: string; description: string; price: number; category: string; rating: number }) {
            const temp = db.table('items').orderBy('id').reverse().toArray().then((items) => {
                if (items.length > 0) {
                    const largestItem = items[0];
                    console.log('data before mutation:', data);
                    return { ...data, ["id"]: largestItem.id + 1 }
                } else {
                    console.log('No items found');
                }
            }) 
            console.log('data after mutation:', data);

            return temp;
        }

        async function addImage(imageData: any) {
            return { ...productData, ["image"] : imageData }
        }

        async function addData(productData: { id: any; image: any; title: string; description: string; price: number; category: string; rating: number } | undefined) {
            console.log(productData)
            db.table('items').add(productData).then(() => {
                setTimeout(()=>{
                    router.push('/')
                }, 500)

            }).catch((err) => {
                console.error(err);
            });            
        }

        setAddSuccess( prev => !prev )

        const data = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        const res = await data.json() 
        const imageData = await addImage(res.image)
        const finalData = await addId(imageData)
        await addData(finalData)
    }


    return(
        <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 lg:w-5/12 mt-10 lg:border h-full rounded lg:shadow-md m-auto p-4"
        >
            <h1 className="text-2xl font-light text-[#ee5d31] mx-2">Add New Product</h1>
            <input
                onChange={handleChange}
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
                type="text"
                name="title"
                placeholder="Title"
            />
            <input
                onChange={handleChange}
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
                type="number"
                name="price"
                placeholder="Price($1)"
            />
            <input
                onChange={handleChange}
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
                type="text"
                name="description"
                placeholder="Description"
            />

            <select
                onChange={handleChange}
                id="category"
                name="category"
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
            >
                <option value="electronics">electronics</option>
                <option value="jevelery">jewelery</option>  
                <option value="men's clothing">men&apos;s clothing</option>
                <option value="women's clothing">women&apos;s clothing</option>  
            </select>

            <input
                type="file"
                name="image"
                onChange={(e) => {
                setImageFile(e.target.files?.[0]);
                }}
            />

            <button
                className="flex bg-[#FF8A65] active:bg-[#FF8A65] hover:bg-[#e47858] text-white rounded-xl mt-3 p-2 justify-center w-full"
            >
                Add product
            </button>

            <div
                style={{ display: addSuccess ? "" : "none" }}
                className="bg-white p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-center shadow-lg absolute rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <h1 className="font-bold text-xl my-2 text-green-600">Hold on!</h1>
                <p className="text-sm">Adding product</p>
                <p className="font-bold text-gray-400 my-3">Please wait...</p>
            </div>
        </form>
    )
}