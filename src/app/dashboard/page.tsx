'use client'

import api, { ResponseJson } from '@/lib/api'
import { COLORS } from '@/lib/colors'
import { IProduct } from '@/lib/models/product.model'
import AppButton, { BUTTON_TYPE } from '@/shared/components/Button'
import AppInput from '@/shared/components/Input'
import React, { useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import ProductForm from './product-form'
import { toast } from 'sonner'
import { ISettingsContext, useSettingsContext } from '@/lib/contexts/settings.context'
import Swal from 'sweetalert2'

const Dashboard = () => {

  const [products, setProducts] = useState<IProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<IProduct[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [isProductsCountLoading, setIsProductsCountLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined);

  const { settings } = (useSettingsContext() as ISettingsContext)

  const timerRef = useRef<NodeJS.Timeout | null>(null);


  const checkIfProductIsInLowStock = (product: IProduct) => {
    const effectiveThreshold = product.threshold ?? threshold;
    return product.quantity <= effectiveThreshold;
  }

  const filterLowStockProducts = () => {
    const lowStockItems = products.filter(product => {
      return checkIfProductIsInLowStock(product);
    })
    setLowStockProducts(lowStockItems);
  }

  useEffect(() => {
    // eslint-disable-next-line
    filterLowStockProducts();
  }, [products]);

  const getProducts = async (searchTerm = '') => {
    setIsProductsLoading(true);
    // eslint-disable-next-line
    const filter: {[key: string]: any} = {
      search: searchTerm
    }
    try {
      const response = await api.get<ResponseJson<IProduct[]>>('products', { params: filter });
      setIsProductsLoading(false);
      if(response.data.success) {
        const allProducts = [...response.data.data];
        setProducts(allProducts);
        
        const addedQuantity = allProducts.reduce(
          (sum, item) => sum + (item.quantity > 0 ? item.quantity : 0), 0
        );
        setQuantity(addedQuantity);
      }
    } catch (error) {
      console.log("Get Products failed", error);
    }
  }

  const getProductsCount = async (searchTerm = '') => {
    setIsProductsCountLoading(true);
    // eslint-disable-next-line
    const filter: {[key: string]: any} = {
      search: searchTerm
    }
    try {
      const response = await api.get<ResponseJson<number>>('products/count', { params: filter });
      setIsProductsCountLoading(false);
      if(response.data.success) {
        setProductsCount(response.data.data);
      }
    } catch (error) {
      console.log("Get Products count failed", error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
    getProducts();
    getProductsCount();
  }, []);

  useEffect(() => {
    if(settings === undefined) return;
    // eslint-disable-next-line
    setThreshold(settings.threshold);
    // eslint-disable-next-line
  }, [settings]);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if(timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      getProducts(value);
      getProductsCount(value);
    }, 1000);
  }

  const handleCloseForm = () => {
    setShowProductForm(false);
    setIsEdit(false);
    setSelectedProduct(undefined);
  }

  const handleFormSuccess = () => {
    toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
    getProducts();
    getProductsCount();
    handleCloseForm();
  }

  const patchForm = (product: IProduct) => {
    setSelectedProduct(product);
    setIsEdit(true);
    setShowProductForm(true);
  }

  const handleDeleteProduct = async (e: React.MouseEvent, product: IProduct) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Delete',
      text: `Are you sure you want to Delete ${product.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: COLORS.BUTTON_DANGER_BACKGROUND_COLOR,
      cancelButtonColor: COLORS.BUTTON_SECONDARY_BACKGROUND_COLOR,
      confirmButtonText: 'Delete'
    }).then(async result => {
      if(result.isConfirmed) {
        const response = await api.post<ResponseJson<boolean>>('products/delete', { id: product._id });
        if(response.data.success && response.data.data) {
          toast.success(`${product.name} deleted successfully`);
          getProducts();
          getProductsCount();
        } 
      }
    })
  }

  return (
    <div className="flex w-full pr-4 pl-4 pt-2 pb-2 relative overflow-hidden">
      <div className="w-[60%] flex flex-col justify-start gap-4 pl-4 pr-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">Products</div>
          <div className="flex gap-4 justify-center items-center">
            <div className="text-md font-semibold flex items-center gap-2">Products: {isProductsCountLoading ? <ClipLoader color={COLORS.SPINNER_COLOR} size={20} speedMultiplier={0.8}/> : productsCount}</div>
            <div className="text-md font-semibold flex items-center gap-2">Quantity on Hand: { isProductsLoading ? <ClipLoader color={COLORS.SPINNER_COLOR} size={20} speedMultiplier={0.8}/> : quantity}</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <AppInput label='' value={search} placeholder='Search for Name or SKU' className='w-75' onChange={(e) => handleSearchChange(e.target.value)}></AppInput>
          <AppButton buttontype={BUTTON_TYPE.PRIMARY} onClick={() => setShowProductForm(true)}>Add Product</AppButton>
        </div>
        <div className="flex-1 scroll-auto p-2 border border-amber-50 rounded-md w-full flex justify-center items-center">
          { isProductsLoading && <ClipLoader color={COLORS.SPINNER_COLOR} size={35} speedMultiplier={0.8} /> }
          { !isProductsLoading && products.length===0 && <div className='text-xl text-center font-semibold'>No Products found</div> }
          {!isProductsLoading && products.length>0 &&
            <table className='w-full h-full flex flex-col'>
              <thead className='bg-gray-500 rounded-sm'>
                <tr className='w-full flex justify-evenly items-center'>
                  <th className='flex justify-center items-center w-full p-4'>Name</th>
                  <th className='flex justify-center items-center w-full p-4'>SKU</th>
                  <th className='flex justify-center items-center w-full p-4'>Quantity</th>
                  <th className='flex justify-center items-center w-full p-4'>Low Stock</th>
                  <th className='flex justify-center items-center w-full p-4'>Selling Price</th>
                  <th className='flex justify-center items-center w-full p-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((product) => (
                    <tr key={product._id} className='border-b hover:bg-gray-900 cursor-pointer w-full flex justify-evenly items-center' onClick={() => patchForm(product)}>
                      <td className='flex justify-center items-center w-full p-4'>{ product.name }</td>
                      <td className='flex justify-center items-center w-full p-4'>{ product.sku }</td>
                      <td className='flex justify-center items-center w-full p-4'>{ product.quantity }</td>
                      <td className={`flex justify-center items-center w-full p-4 ${checkIfProductIsInLowStock(product) ? 'text-red-400' : 'text-green-400'}`} >{ checkIfProductIsInLowStock(product) ? 'YES' : 'NO' }</td>
                      <td className='flex justify-center items-center w-full p-4'>{ product.sellingPrice ?? "NA" }</td>
                      <td className='flex justify-center items-center w-full p-4'><AppButton buttontype={BUTTON_TYPE.SECONDARY} onClick={(e) => handleDeleteProduct(e, product)}>Delete</AppButton></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          }
        </div>
      </div>

      {(!isProductsLoading && lowStockProducts.length>0) && 
        <div className='w-[40%] flex flex-col justify-start gap-4 pl-4 pr-4'>
          <div className="text-2xl font-semibold">Low Stock Items</div>
          <div className="flex-1 scroll-auto p-2 border border-amber-50 rounded-md w-full flex justify-center items-center">
            <table className='w-full h-full flex flex-col'>
              <thead className='bg-gray-500 rounded-sm'>
                <tr className='w-full flex justify-evenly items-center'>
                  <th className='flex justify-center items-center w-full p-4'>Name</th>
                  <th className='flex justify-center items-center w-full p-4'>SKU</th>
                  <th className='flex justify-center items-center w-full p-4'>Quantity</th>
                  <th className='flex justify-center items-center w-full p-4'>Threshold</th>
                  <th className='flex justify-center items-center w-full p-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  lowStockProducts.map((product) => (
                    <tr key={product._id} className='border-b hover:bg-gray-900 cursor-pointer w-full flex justify-evenly items-center' onClick={() => patchForm(product)}>
                      <td className='flex justify-center items-center w-full p-4'>{ product.name }</td>
                      <td className='flex justify-center items-center w-full p-4'>{ product.sku }</td>
                      <td className='flex justify-center items-center w-full p-4'>{ product.quantity }</td>
                      <td className={`flex justify-center items-center w-full p-4`} >{ product.threshold ?? threshold }</td>
                      <td className='flex justify-center items-center w-full p-4'><AppButton buttontype={BUTTON_TYPE.SECONDARY} onClick={(e) => handleDeleteProduct(e, product)}>Delete</AppButton></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      {/* add product side drawer */}
      <div className={`w-100 absolute bg-gray-900 h-full transition-all duration-300 ease-in-out ${showProductForm ? "right-0" : "-right-100" }`}>
        <ProductForm success={handleFormSuccess} isEdit={isEdit} onClose={handleCloseForm} product={selectedProduct} />
      </div>
    </div>
  )
}

export default Dashboard