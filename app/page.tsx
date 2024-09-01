'use client'
import { useState, useEffect, useRef } from 'react';
import { Star1 } from 'iconsax-react'
import { db } from '@/app/db'
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import crypto from 'crypto';

type product = {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
}

export default function Home() {
  let productFetch = useRef<product[]>([])
  const [products, setProducts] = useState<product[]>([])
  const categories = [ "All", "electronics", "jewelery", "men's clothing", "women's clothing" ]
  const [category, setCategory] = useState<string>('All')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const router = useRouter();

  async function getProducts() {
    let query;  
    if (category !== 'All') {
      query = db.table('items').where('category').equals(category);
    } else {
      query = db.table('items');
    }
  
    productFetch.current = await query.toArray();
    setProducts(productFetch.current);
  }
 
  function rating(num: number) {
    const rate = Math.round(num)
    const jsxArr = []

    for (let i = 0; i < 5; i++) {
        jsxArr.push( (i < rate)? true : false )         
    }
    return jsxArr
  }

  function handlePriceChange(event: { target: { name: any; value: any; }; }){
    setPriceRange( (prev) => {
      return { ...prev, [event.target.name]: Number(event.target.value) }
    } )
  }

  function productFilter() {
    const newProducts = productFetch.current.filter((product) => {
      if(category != 'All'){
        return (
          product.category === category &&
          product.price >= priceRange.min &&
          product.price <= priceRange.max
        );        
      }
      return (
        product.price >= priceRange.min &&
        product.price <= priceRange.max        
      )
    });

    setProducts(newProducts)
  }

  function encryptObject(obj: any): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from('otonye-hillary-edwin-darian-edin'), iv);
    let encrypted = cipher.update(JSON.stringify(obj), 'utf8', 'hex');
    encrypted += cipher.final('hex');
  
    return `${iv.toString('hex')}:${encrypted}`;
  }

  const handleClick = (index: { id: any; title: any; description?: string; price?: number; image?: string; category?: string; rating?: number; decription?: any; }) => {
    const query = { productId:  index.id, productTitle: index.title, productDescription: index.decription }
    const product = encryptObject(query)
    router.push(`/products/${product}`);
  };

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    productFilter()
  }, [ category, priceRange ])


  return (
      <section className="h-[95%] m-auto p-4 w-11/12 mb-auto bg-slate-50  bg-opacity-15 backdrop-blur-sm border-opacity-20 rounded-xl flex flex-col justify-start relative"> 
        <div className="font-bold text-xl text-gray-600">
          {/* <h1 className='border-s-2 border-[#FF8A65] ps-6 mb-3'>Categories</h1> */}

          <div className="flex flex-wrap justify-center mb-2">
            {
              categories && (
                categories?.map((index, key) => {
                  return (
                    <p
                      className={`${
                        category == index
                          ? 'text-[#FF8A65] underline font-semibold'
                          : 'text-gray-400'
                      } font-extralight cursor-pointer text-lg hover:text-[#FF8A65] mx-2 md:mx-4 lg:mx-6`}
                      key={key}
                      onClick={() => {
                        setCategory(index);
                      }}
                    >
                      {index}
                    </p>
                  );
                })
              )
            }
          </div>

          <hr />

          <div className="price flex justify-end md:justify-center">
            <div className="flex flex-col border my-2 rounded px-1 py-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
              <p className="text-sm font-bold mx-3 mb text-[#ff8661] text-center">Price filter</p>
              
              <div className="flex mx-3 my-1 font-light flex-wrap justify-center">
                <input
                  type="number"
                  className="text-xs mt-1 font-medium w-full md:w-1/2 lg:w-1/3 xl:w-1/4 md:me-3 rounded outline-1 outline-[#FF8A65] py-1 px-2 border border-gray-400"
                  min={0}
                  value={priceRange.min}
                  name="min"
                  onChange={handlePriceChange}
                />
                <input
                  type="number"
                  className="text-xs mt-1 font-medium w-full md:w-1/2 lg:w-1/3 xl:w-1/4 rounded outline-1 outline-[#FF8A65] py-1 px-2 border border-gray-400"
                  min={priceRange.min}
                  value={priceRange.max}
                  name="max"
                  onChange={handlePriceChange}
                />
              </div>

              <div className="flex mx-3 font-light text-sm justify-center">
                {`$(${priceRange.min} - ${priceRange.max})`}
              </div>
            </div>
          </div>

        </div>
        {/* //PRODUCTS */}
        <div className="pt-1 flex flex-wrap justify-center">
          {
            products && (
              products?.map((index: product, key) => {
                return (
                  <div
                    key={key}
                    className="flex flex-col mx-2 my-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/5 p-2 bg-white rounded-xl justify-between border hover:border-[#ff8965a4] transition-all"
                  >
                    <img
                      src={index.image}
                      alt="product image"
                      className="w-1/3 lg:w-[5rem] aspect-auto my-auto py-3 mx-auto rounded-xl"
                    />

                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="text-xs font-extrabold my-1">
                        {index.title }
                      </p>
                      <div className="flex flex-col justify-between mt-1">
                        <div className="text-5xl font-extralight flex my-3">
                          <span className="text-xl mb-auto text-[#FF8A65] font-semibold">$</span>
                          {index.price }
                        </div>
                        <div className="flex mt-auto">
                          {rating(index?.rating).map((index, key) => {
                            return (
                              <Star1 key={ key } size="15" color={`${index ? '#FF8A65' : 'gray'}`} />
                            );
                          })}
                        </div>
                        <div
                          onClick={() => {
                            handleClick(index);
                          }}
                          className="flex bg-[#FF8A65] active:bg-[#FF8A65] hover:bg-[#e47858] text-white rounded-xl mt-3 p-2 justify-center"
                        >
                          See Product
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          }
        </div>     
      </section> 
  )
}   