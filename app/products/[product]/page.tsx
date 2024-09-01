'use client'
import { useState, useEffect } from 'react';
import { Star1 } from 'iconsax-react'
import { db } from '@/app/db'
import Skeleton from 'react-loading-skeleton'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import crypto from 'crypto';

function decryptObject(encryptedString: string): any {
    const [iv, encryptedData] = encryptedString.split('%3A');
    console.log('the two parts are',iv, encryptedData);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from('otonye-hillary-edwin-darian-edin'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log('the decrypted data is:', decrypted);
    return JSON.parse(decrypted);
}

type product = {
    id: number
    title: string
    description: string
    price: string
    image: string
    rating: number

}

export default function Home({ params }: { params: { product: string } }){
    const decrypted = decryptObject(params.product)
    const temp = {
        id: 0,
        title: '',
        description: '',
        price: '',
        image: '',
        rating:  0
      }
    const [product, setProduct] = useState<product>(temp)
    const [deleteItem, setDeleteItem] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const router = useRouter()
    
    function getProduct() {
        db.table('items').get(Number(decrypted.productId)).then((item) => {
            setProduct(item)
        }).catch((error) => {
            console.error('Error fetching item:', error);
        });
    }

    function rating(num: number) {
        const rate = Math.round(num)
        const jsxArr = []
    
        for (let i = 0; i < 5; i++) {
            jsxArr.push( (i < rate)? true : false )         
        }
        return jsxArr
    }

    function askToDelete() {
        setDeleteItem( prev => !prev )
    }

    async function handleDelete() {
        await db.transaction('rw', db.table('items'), async () => {
            await db.table('items').delete( Number(decrypted.productId) );
            setDeleteItem( prev => !prev )
            setDeleteSuccess( prev => !prev )

            setTimeout(()=>{
                router.push('/')
            }, 1000)   

        }).catch((error) => {
        console.error('Transaction failed:', error);
        });
    }

    useEffect(() => {
        getProduct()
    }, [])

    return(
        <div className="pt-2 flex flex-wrap justify-center w-full relative">
            <div
                className="flex flex-wrap mx-2 my-4 w-full md:w-7/12 xl:w-6/12 m-auto text-gray-700 bg-white p-4 rounded-xl justify-between border shadow-lg transition-all"
            >
                <img
                src={product?.image}
                alt="product image"
                className="w-3/4 md:w-4/12 aspect-auto my-auto py-6 mx-auto rounded-xl"
                />

                <div
                className="flex flex-col justify-between w-full md:w-1/2 bg-slate-50 rounded-xl p-6 border"
                >
                <p className="text-md font-extrabold my-1">{product?.title || <Skeleton count={3} />}</p>
                <p className="text-sm font-thin my-1">{product?.description || <Skeleton count={3} />}</p>

                <div className="flex flex-col justify-between mt-1">
                    <div className="text-5xl font-extralight flex my-3">
                    <span className="text-xl mb-auto text-[#FF8A65] font-semibold">$</span>
                    {product?.price || <Skeleton />}
                    </div>

                    <div className="flex mt-auto">
                    {rating(product.rating).map((index, key) => {
                        return (
                        <Star1 key={key} size="15" color={`${index ? '#FF8A65' : 'gray'}`} />
                        );
                    })}
                    </div>

                    <Link
                    href={`/edit-products/${product.id}`}
                    className="flex bg-[#FF8A65] active:bg-[#FF8A65] hover:bg-[#e47858] text-white p-2 rounded-xl mt-5 justify-center w-full"
                    >
                        Edit
                    </Link>

                    <button
                    onClick={askToDelete}
                    className="cursor-pointer flex bg-red-500 active:bg-red-500 hover:bg-red-700 text-white p-2 rounded-xl mt-3 justify-center w-full"
                    >
                        Delete
                    </button>
                </div>
                </div>
            </div>

            <div
                style={{ display: deleteItem ? "" : "none" }}
                className="bg-white p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-center shadow-lg rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <h1 className="font-bold text-xl my-2">Alert!</h1>
                <p className="text-sm">Are you sure about this action?</p>

                <button
                onClick={handleDelete}
                className="flex bg-red-500 text-white p-2 px-6 mx-auto rounded-sm mt-6 justify-center w-full"
                >
                Delete
                </button>
            </div>

            <div
                style={{ display: deleteSuccess ? "" : "none" }}
                className="bg-white p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-center shadow-lg rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <h1 className="font-bold text-xl my-2">Yayyyy</h1>
                <p className="text-sm">Item deleted successfully</p>
                <p className="font-bold text-gray-400 my-3">redirecting...</p>

                <button
                onClick={() => {
                    setDeleteSuccess((prev) => !prev);
                }}
                className="flex bg-green-500 text-white p-2 px-6 mx-auto rounded-sm mt-6 justify-center w-full"
                >
                Done
                </button>
            </div>
        </div>      
    )
}