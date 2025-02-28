import DOMPurify from "dompurify";

export default function ProfileBio({ bio }: { bio: string }) {
  return (
    <div className="relative py-10 px-6 md:px-10">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full translate-x-1/3 translate-y-1/3" />

      {/* Content */}
      <div className="relative z-10 backdrop-blur-sm bg-background/60 rounded-xl p-6 border border-muted shadow-lg">
        {/* Simple heading that will definitely be visible */}
        <div className="relative mb-8">
          <h1 className="text-3xl font-bold text-start">My Story</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
        </div>

        <div
          className="prose max-w-none text-start relative overflow-hidden"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bio) }}
        />
      </div>
    </div>
  );
}
