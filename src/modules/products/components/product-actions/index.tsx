import { useProductActions } from "@lib/context/product-context"
import useProductPrice from "@lib/hooks/use-product-price"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import Button from "@modules/common/components/button"
import OptionSelect from "@modules/products/components/option-select"
import clsx from "clsx"
import Link from "next/link"
import React, { useMemo, useState } from "react"
import { Product } from "types/medusa"
import My3DComponent from './My3DComponent';
import Modal from './Modal';  

type ProductActionsProps = {
  product: PricedProduct
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const {
    updateOptions,
    addToCart,
    options,
    inStock,
    variant,
    customText,
    updateCustomText,
  } = useProductActions()

  const price = useProductPrice({ id: product.id!, variantId: variant?.id })

  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col gap-y-2">
      {product.collection && (
        <Link
          href={`/collections/${product.collection.handle}`}
          className="text-small-regular text-gray-700"
        >
          {product.collection.title}
        </Link>
      )}
      <h3 className="text-xl-regular">{product.title}</h3>

      <p className="text-base-regular">{product.description}</p>

   

      {product.variants.length > 1 && (
        <div className="my-8 flex flex-col gap-y-6">
          
          {(product.options || []).map((option) => {
            return (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={updateOptions}
                  title={option.title}
                  
                />
              </div>
              
            )
          })}
        </div>
      )}

      <div className="mb-4">
        {selectedPrice ? (
          <div className="flex flex-col text-gray-700">
            <span
              className={clsx("text-xl-semi", {
                "text-rose-600": selectedPrice.price_type === "sale",
              })}
            >
              {selectedPrice.calculated_price}
            </span>
            {selectedPrice.price_type === "sale" && (
              <>
                <p>
                  <span className="text-gray-500">Original: </span>
                  <span className="line-through">
                    {selectedPrice.original_price}
                  </span>
                </p>
                <span className="text-rose-600">
                  -{selectedPrice.percentage_diff}%
                </span>
              </>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="mb-4 relative p-2">
        <input
          id="customText"
          type="text"
          value={customText}
          onChange={(e) => updateCustomText(e.target.value)}
          placeholder=" "
          className="w-full p-2 border-b-2 border-gray-300 focus:border-indigo-500 bg-transparent text-lg focus:outline-none transition duration-300 ease-in-out"
        />
        <label
          htmlFor="customText"
          className={`absolute left-2 top-2 text-lg text-gray-500 transition-all duration-300 ease-in-out ${
            customText ? "transform -translate-y-6 text-indigo-500" : ""
          }`}
        >
          Personalize aquí
        </label>
      </div>
      <div onClick={openModal} className="cursor-pointer">
      <p className="text-center text-sm text-gray-700 mb-2">Ver en 3D</p>
        <My3DComponent customText={customText} variantTitle={variant?.title} width={150} height={150} />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <My3DComponent customText={customText} variantTitle={variant?.title} width={500} height={500} />
      </Modal>
      <Button onClick={addToCart}>
        {!inStock ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  )
}

export default ProductActions
