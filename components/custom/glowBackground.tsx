export default function GlowBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background">
      <div className="absolute left-0 top-0 h-[40%] w-[50%] opacity-30 dark:opacity-20">
        <div className="absolute right-1/4 h-[300px] w-[300px] rounded-full bg-blue-500 blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-0 h-[250px] w-[250px] rounded-full bg-purple-500 blur-[150px]"></div>
      </div>
    </div>
  );
}
