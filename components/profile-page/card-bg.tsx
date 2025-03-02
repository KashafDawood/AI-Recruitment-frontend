export const CardBg = ({ name }: { name: string | undefined }) => {
  const formatedName = name?.split(" ")[0].toUpperCase();

  // Reduce number of repetitions and add proper containment
  return (
    <div className="w-full h-full overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex justify-center font-vertigo p-0 bg-green-400 dark:bg-green-600 text-green-300 dark:text-green-700"
        >
          <span className="text-[120px] md:text-[200px] font-black tracking-tighter opacity-80 leading-[0.7] whitespace-nowrap">
            {formatedName}
          </span>
          <span className="text-[120px] md:text-[205px] font-black tracking-tighter opacity-80 leading-[0.7] whitespace-nowrap">
            {formatedName}
          </span>
          <span className="text-[120px] md:text-[200px] font-black tracking-tighter opacity-80 leading-[0.7] whitespace-nowrap">
            {formatedName}
          </span>
        </div>
      ))}
    </div>
  );
};
