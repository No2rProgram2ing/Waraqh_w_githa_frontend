export { WishlistsPage } from "./WishlistsPageFixed";
                </div>

                <p className="text-[16px] font-bold text-[#1c211b]">{item.name}</p>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[17px] font-extrabold text-[#1d2218]">
                    {formatAmount(item.price)}
                  </span>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4f5f3d] text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] transition-transform duration-200 hover:scale-105"
                    aria-label={`إضافة ${item.name} إلى السلة`}
                  >
                    <ShoppingBagIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
=======
        {renderContent()}
>>>>>>> dad121843105060107acde3b906c6c7d331c9270
      </motion.section>
    </AccountLayout>
  );
}
