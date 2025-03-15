import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileEdit, Users, Mail, FileSignature } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-10 md:py-14 dark:bg-transparent">
      <div className="flex justify-center flex-col text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Features
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Discover our AI-powered recruitment tools designed to streamline your
          hiring process and connect the right talent with the right
          opportunities.
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 dark:bg-gray-800">
              <CardContent className="relative m-auto size-fit pt-6">
                <div className="relative flex h-24 w-56 items-center">
                  <svg
                    className="text-muted absolute inset-0 size-full"
                    viewBox="0 0 254 104"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="mx-auto block w-fit text-5xl font-semibold">
                    1-Click
                  </span>
                </div>
                <h2 className="mt-6 text-center text-3xl font-semibold">
                  Easy Job Apply
                </h2>
              </CardContent>
            </Card>
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                  <FileText
                    className="m-auto size-16 text-zinc-400 dark:text-zinc-600"
                    strokeWidth={1}
                  />
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h2 className="group-hover:text-secondary-950 text-lg font-medium transition dark:text-white">
                    AI Candidate Bio Generator
                  </h2>
                  <p className="text-foreground">
                    Create professional candidate bios automatically with our
                    AI-powered generator. Highlight skills and experience
                    effectively.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                  <FileEdit
                    className="m-auto size-16 text-zinc-400 dark:text-zinc-600"
                    strokeWidth={1}
                  />
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h2 className="text-lg font-medium transition">
                    AI Job Post Generator
                  </h2>
                  <p className="text-foreground">
                    Create compelling job descriptions in seconds with our
                    AI-powered job post generator. Attract the right candidates
                    effortlessly.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3 dark:bg-gray-800">
              <CardContent className="grid pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Users className="m-auto size-5" strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white">
                      AI Candidate Recommendation
                    </h2>
                    <p className="text-foreground">
                      Our AI matches the perfect candidates to your job postings
                      based on skills, experience, and cultural fit.
                    </p>
                  </div>
                </div>
                <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 py-6 sm:ml-6">
                  <div className="absolute left-3 top-2 flex gap-1">
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                  </div>
                  <svg
                    className="w-full sm:w-[150%]"
                    viewBox="0 0 366 231"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.148438 231V179.394L1.92188 180.322L2.94482 177.73L4.05663 183.933L6.77197 178.991L7.42505 184.284L9.42944 187.985L11.1128 191.306V155.455L13.6438 153.03V145.122L14.2197 142.829V150.454V154.842L15.5923 160.829L17.0793 172.215H19.2031V158.182L20.7441 153.03L22.426 148.111V142.407L24.7471 146.86V128.414L26.7725 129.918V120.916L28.1492 118.521L28.4653 127.438L29.1801 123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988V148.111L123.4 152.613L125.401 158.182L130.547 150.454V156.566L131.578 155.455L134.143 158.182L135.594 168.136L138.329 158.182L140.612 160.829L144.681 169.5L147.011 155.455L148.478 151.787L151.02 152.613L154.886 145.122L158 143.412L159.406 140.637L159.496 133.348L162.295 127.87V122.082L163.855 116.645V109.729L164.83 104.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.357 74.9864L332.611 52.6565L334.352 48.5552L335.785 55.2637L338.377 59.5888V73.426L341.699 87.5181L343.843 93.4347L347.714 82.1171L350.229 78.6821L351.974 89.7556L353.323 94.9932L355.821 93.4347L357.799 102.127L360.684 108.794L363.219 98.004L365 89.7556"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_0_705"
                        x1="0.85108"
                        y1="0.947876"
                        x2="0.85108"
                        y2="230.114"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          className="text-primary/20 dark:text-primary/30"
                          stopColor="currentColor"
                        />
                        <stop
                          className="text-transparent"
                          offset="1"
                          stopColor="currentColor"
                          stopOpacity="0.01"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </CardContent>
            </Card>
            <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3 dark:bg-gray-800">
              <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Mail className="m-auto size-6" strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium transition">
                      Automated Emails
                    </h2>
                    <p className="text-foreground">
                      Send personalized emails to candidates at every stage of
                      the hiring process. Improve communication and candidate
                      experience.
                    </p>
                  </div>
                </div>
                <div className="relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px before:bg-border dark:before:bg-border sm:-my-6 sm:-mr-6">
                  <div className="relative flex h-full flex-col justify-center space-y-8 py-6">
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit bg-background px-2 py-1 text-xs dark:bg-muted/30">
                        Application Received
                      </span>
                      <div className="ring-background flex size-7 items-center justify-center rounded-full bg-green-100 ring-4 dark:bg-green-900/20 dark:ring-background/70">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4 text-green-600 dark:text-green-400"
                        >
                          <path
                            d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="relative flex w-[calc(50%+0.875rem)] ml-[calc(50%-0.875rem)] items-center gap-2">
                      <div className="ring-background flex size-7 items-center justify-center rounded-full bg-blue-100 ring-4 dark:bg-blue-900/20 dark:ring-background/70">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4 text-blue-600 dark:text-blue-400"
                        >
                          <path
                            d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0 7.5C0 7.22386 0.223858 7 0.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5ZM12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.6081 2.00144 12.8033 2.1967ZM15 7.5C15 7.77614 14.7761 8 14.5 8H12.5C12.2239 8 12 7.77614 12 7.5C12 7.22386 12.2239 7 12.5 7H14.5C14.7761 7 15 7.22386 15 7.5ZM4.56757 11.8245L3.05029 11.8245L5.25029 7.82345L5.90029 8.80655L4.56757 11.8245ZM6.79742 13.5L5.87093 11.8245H3.48369L2.55721 13.5H1.5L5.08548 6H6.30369L9.88918 13.5H6.79742ZM8.95627 11.8245L7.62354 8.80655L8.27354 7.82345L10.4735 11.8245H8.95627Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="block h-fit bg-background px-2 py-1 text-xs dark:bg-muted/30">
                        Interview Scheduled
                      </span>
                    </div>
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit bg-background px-2 py-1 text-xs dark:bg-muted/30">
                        Offer Letter
                      </span>
                      <div className="ring-background flex size-7 items-center justify-center rounded-full bg-purple-100 ring-4 dark:bg-purple-900/20 dark:ring-background/70">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4 text-purple-600 dark:text-purple-400"
                        >
                          <path
                            d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative col-span-full overflow-hidden sm:col-span-6 lg:col-span-6 dark:bg-gray-800">
              <CardContent className="grid pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <FileSignature className="m-auto size-5" strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white">
                      AI Contract Generator
                    </h2>
                    <p className="text-foreground">
                      Generate legally-sound employment contracts tailored to
                      your specific requirements with our AI-powered contract
                      generator.
                    </p>
                  </div>
                </div>
                <div className="relative mt-6 flex items-center justify-center">
                  <div className="relative w-full max-w-xs rounded-lg border bg-background p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Employment Contract
                      </div>
                      <div className="flex gap-1">
                        <button className="text-muted-foreground hover:text-foreground rounded p-1 transition">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                          >
                            <path
                              d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                        <button className="text-muted-foreground hover:text-foreground rounded p-1 transition">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                          >
                            <path
                              d="M3.25 1C3.25 0.585786 3.58579 0.25 4 0.25H11C11.4142 0.25 11.75 0.585786 11.75 1C11.75 1.41421 11.4142 1.75 11 1.75H4C3.58579 1.75 3.25 1.41421 3.25 1ZM0.25 3C0.25 2.58579 0.585786 2.25 1 2.25H14C14.4142 2.25 14.75 2.58579 14.75 3V14C14.75 14.4142 14.4142 14.75 14 14.75H1C0.585786 14.75 0.25 14.4142 0.25 14V3ZM1.75 3.75V13.25H13.25V3.75H1.75Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                        <button className="text-muted-foreground hover:text-foreground rounded p-1 transition">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                          >
                            <path
                              d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.5C9.77614 2 10 2.22386 10 2.5C10 2.77614 9.77614 3 9.5 3H3.5C3.22386 3 3 2.77614 3 2.5ZM3 4.5C3 4.22386 3.22386 4 3.5 4H9.5C9.77614 4 10 4.22386 10 4.5C10 4.77614 9.77614 5 9.5 5H3.5C3.22386 5 3 4.77614 3 4.5ZM3 6.5C3 6.22386 3.22386 6 3.5 6H9.5C9.77614 6 10 6.22386 10 6.5C10 6.77614 9.77614 7 9.5 7H3.5C3.22386 7 3 6.77614 3 6.5ZM3.5 8C3.22386 8 3 8.22386 3 8.5C3 8.77614 3.22386 9 3.5 9H9.5C9.77614 9 10 8.77614 10 8.5C10 8.22386 9.77614 8 9.5 8H3.5ZM3.5 10C3.22386 10 3 10.2239 3 10.5C3 10.7761 3.22386 11 3.5 11H7.5C7.77614 11 8 10.7761 8 10.5C8 10.2239 7.77614 10 7.5 10H3.5ZM11.1 9.5C11.1 10.3284 10.4284 11 9.6 11C8.77157 11 8.1 10.3284 8.1 9.5C8.1 8.67157 8.77157 8 9.6 8C10.4284 8 11.1 8.67157 11.1 9.5ZM12.5 12.9C12.5 12.0716 11.8284 11.4 11 11.4C10.1463 11.4 9.37566 11.4694 8.81454 11.6057C8.27599 11.7371 8.1 11.8769 8.1 12V13.5C8.1 13.5 9.05442 13 11 13C11.8284 13 12.5 12.3284 12.5 11.5V12.9ZM11 10.4C9.83051 10.4 8.74337 10.4949 7.94153 10.6932C7.14227 10.8916 6.1 11.3724 6.1 12.5V13.5C6.1 13.7761 6.32386 14 6.6 14H13.4C13.6761 14 13.9 13.7761 13.9 13.5V12.5C13.9 11.3724 12.8577 10.8916 12.0585 10.6932C11.2566 10.4949 10.1695 10.4 9 10.4H11ZM14 9.5C14 10.6046 13.1046 11.5 12 11.5C11.2052 11.5 10.4906 11.0932 10.1406 10.4718C10.4741 10.1803 10.7167 9.77895 10.8 9.32129C10.8995 9.42753 11.0348 9.5 11.1818 9.5H12.8182C12.9652 9.5 13.1005 9.42753 13.2 9.32129C13.2833 9.77895 13.5259 10.1803 13.8594 10.4718C13.5094 11.0932 12.7948 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5ZM14.5 12.5C14.5 12.0668 14.358 11.6207 14.0787 11.3109C14.3421 10.8633 14.5 10.3528 14.5 9.8V7.5C14.5 6.94772 14.0523 6.5 13.5 6.5H10.5C9.94772 6.5 9.5 6.94772 9.5 7.5V9.8C9.5 10.3528 9.65792 10.8633 9.9213 11.3109C9.64198 11.6207 9.5 12.0668 9.5 12.5V13.5C9.5 14.0523 9.94772 14.5 10.5 14.5H13.5C14.0523 14.5 14.5 14.0523 14.5 13.5V12.5ZM1.5 1C1.22386 1 1 1.22386 1 1.5V13.5C1 13.7761 1.22386 14 1.5 14C1.77614 14 2 13.7761 2 13.5V1.5C2 1.22386 1.77614 1 1.5 1Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-1 w-3/4 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-1 w-5/6 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-1 w-1/2 bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between border-t pt-3 text-xs">
                        <span className="text-muted-foreground">
                          Generated with AI
                        </span>
                        <span className="font-medium">Ready to sign</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
