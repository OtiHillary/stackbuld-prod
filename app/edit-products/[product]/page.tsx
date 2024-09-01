'use client'
import { db } from '@/app/db'
import { IndexableType } from 'dexie'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type product = {
    id: number
    title: string
    description: string
    category: string
    price: string
    image: string
    rating: number
}

export default function Home({ params }: { params: { product: number } }){
    const [ imageFile, setImageFile ] = useState<Blob>()
    const [ productData, setProductData ] = useState<product>()
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const router = useRouter()
    const categories = [ "electronics", "jewelery", "men's clothing", "women's clothing" ]

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

        if(!imageFile) {
            db.table('items').update(Number(params.product), productData).then(() => {
                console.log('Item updated successfully');
                setUpdateSuccess( prev => !prev )

                setTimeout(()=>{
                    router.push('/')
                }, 500)

              }).catch((error) => {
                console.error('Error updating item:', error);
              });
            return
        }
        formData.append('image', imageFile)
        
        async function addId(data: any) {
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

        async function addData(productData: (obj: any, ctx: { value: any; primKey: IndexableType }) => void | boolean) {
            console.log(productData)
            db.table('items').update(Number(params.product), productData).then(() => {
                console.log('item(s) updated successfully');
            }).catch((err) => {
                console.error(err);
            });            
        }

        const data = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })  

        const res = await data.json() 
        const imageData = await addImage(res.image)
        const finalData = await addId(imageData)
        await addData(finalData)

    } 

    useEffect(() => {
        db.table('items').get(Number(params.product)).then((item) => {
            setProductData(item)
        }).catch((error) => {
            console.error('Error fetching item:', error);
        });
    }, [])

    return(
        <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 lg:w-5/12 mt-10 border h-full rounded shadow-md m-auto p-4"
        >
            <h1 className="text-2xl font-light text-[#ee5d31] mx-2">Edit Product</h1>
            <input
                onChange={handleChange}
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
                type="text"
                name="title"
                value={productData?.title}
                placeholder="Title"
            />
            <input
                onChange={handleChange}
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
                type="number"
                name="price"
                value={productData?.price}
                placeholder="Price($1)"
            />
            <input
                onChange={handleChange}
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
                type="text"
                name="description"
                value={productData?.description}
                placeholder="Description"
            />

            <select
                onChange={handleChange}
                id="category"
                name="category"
                className="outline outline-1 outline-gray-300 focus:outline-[#FF8A65] p-3 m-2 rounded w-full"
            >
                {categories.map((category, key) => {
                return (
                    <option key={key} value={category} selected={productData?.category === category ? true : false}>
                    {category}
                    </option>
                );
                })}
            </select>

            <input
                type="file"
                name="image"
                onChange={(e) => {
                setImageFile(e.target.files?.[0]);
                }}
                className="m-2 w-full"
            />

            <button
                className="flex bg-[#FF8A65] active:bg-[#FF8A65] hover:bg-[#e47858] text-white rounded-xl mt-3 p-2 justify-center w-full"
            >
                Update product
            </button>

            <div
                style={{ display: updateSuccess ? "" : "none" }}
                className="bg-white p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-center shadow-lg rounded absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            >
                <h1 className="font-bold text-xl my-2 text-green-600">Yayyyy</h1>
                <p className="text-sm">Product Updated Successfully</p>
                <p className="font-bold text-gray-400 my-3">redirecting...</p>
            </div>
        </form>
    )
}