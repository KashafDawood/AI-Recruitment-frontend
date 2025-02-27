export const CardBg = ({ name }: { name: string | undefined }) => {
  const formatedName = name?.split(" ")[0].toUpperCase();

  // Create an array of size 3 and map over it to render the repeated elements
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="mt-[-50px] flex justify-center p-0 text-green-300 dark:text-green-700"
        >
          <span className="text-[120px] md:text-[200px] font-black tracking-tighter opacity-80 leading-none whitespace-nowrap">
            {formatedName}
          </span>
          <span className="text-[120px] md:text-[205px] font-black tracking-tighter opacity-80 leading-none whitespace-nowrap">
            {formatedName}
          </span>
          <span className="text-[120px] md:text-[200px] font-black tracking-tighter opacity-80 leading-none whitespace-nowrap">
            {formatedName}
          </span>
        </div>
      ))}
    </>
  );
};
