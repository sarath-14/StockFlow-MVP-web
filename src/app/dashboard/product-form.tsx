'use client'

import AppInput from '@/shared/components/Input'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AppButton, { BUTTON_TYPE } from '@/shared/components/Button';
import api, { ResponseJson } from '@/lib/api';
import { IProduct } from '@/lib/models/product.model';
import { useEffect } from 'react';

interface IProductFormProps {
    isEdit: boolean,
    product: IProduct | undefined,
    onClose: () => void,
    success: () => void;
}

const optionalNumber = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    if (typeof val === "number" && isNaN(val)) return undefined;
    return val;
  },
  z.coerce.number().min(0, { message: "must be >= 0" }).optional()
);

const productSchema = z.object({
    name: z.string().nonempty("Product Name is required"),
    sku: z.string().nonempty("SKU is required"),
    quantity: z.coerce.number().min(0, {message: "must be >= 0"}),
    cost: optionalNumber,
    sellingPrice: optionalNumber,
    threshold: optionalNumber,
    description: z.string().optional()
})

const ProductForm = (props: IProductFormProps) => {
    const { register, reset, setValue, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema)
    });

    // eslint-disable-next-line
    const handleFormSubmit = async (data: any) => {
        if(props.product && props.isEdit) {
            data['_id'] = props.product._id;
        }
        const wholeData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                value === undefined ? null : value
            ])
        );
        try {
            const response = await api.post<ResponseJson<boolean>>('products', wholeData);
            if(response.data.success) {
                reset();
                props.success();
            }
        } catch (error) {
            console.log("Failed to submit form", error);
        }
    }

    useEffect(() => {
        const product = props.product;
        if(product && props.isEdit) {
            setValue("name", product.name);
            setValue("sku", product.sku);
            setValue("quantity", product.quantity);
            setValue("cost", product?.cost ?? "" );
            setValue("sellingPrice", product?.sellingPrice ?? "");
            setValue("threshold", product?.threshold ?? "");
            setValue("description", product?.description ?? "");
        }
        else {
            reset();
        }
    }, [props.product, props.isEdit])

    return (
        <div className="flex flex-col h-full w-full p-4 gap-4">
            <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">{props.isEdit ? 'Edit' : 'Add' + ' Product'}</div>
                <div className='text-xl font-semibold w-8 h-8 cursor-pointer text-center' onClick={props.onClose}>X</div>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit)} className='h-full flex flex-col gap-4'>
                <div className="h-[85%] flex flex-col gap-4 overflow-auto pr-4">
                    <AppInput label='Name *' {...register("name")} placeholder='product name' />
                    { errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span> }
                    <AppInput label='SKU *' {...register("sku")} placeholder='SKU' />
                    { errors.sku && <span className="text-red-500 text-sm">{errors.sku.message}</span> }
                    <AppInput type="text" label='Quantity in Hand *' {...register("quantity")} placeholder='quantity' />
                    { errors.quantity && <span className="text-red-500 text-sm">{errors.quantity.message}</span> }
                    <AppInput type="text" label='Cost Price' {...register("cost")} placeholder='cost' />
                    { errors.cost && <span className="text-red-500 text-sm">{errors.cost.message}</span> }
                    <AppInput type="text" label='Selling Price' {...register("sellingPrice")} placeholder='Selling Price' />
                    { errors.sellingPrice && <span className="text-red-500 text-sm">{errors.sellingPrice.message}</span> }
                    <AppInput type="text" label='Low Stock Threshold' {...register("threshold")} placeholder='threshold' />
                        { errors.threshold && <span className="text-red-500 text-sm">{errors.threshold.message}</span> }
                    <AppInput label='Description' {...register("description")} placeholder='description' />
                    { errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span> }
                </div>
                <div className="h-[15%] flex justify-end gap-8 mt-4">
                    <AppButton type="reset" buttontype={BUTTON_TYPE.SECONDARY} onClick={() => reset()}>Clear</AppButton>
                    <AppButton type="submit" buttontype={BUTTON_TYPE.PRIMARY}>{ props.isEdit ? 'Update' : 'Create' }</AppButton>
                </div>
            </form>
        </div>
    )
}

export default ProductForm