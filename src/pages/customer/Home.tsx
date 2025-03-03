import { Link } from "react-router";

const Home = () => {
  return (
    <div className="mx-auto max-w-2xl flex flex-col justify-center items-center">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Announcing our next round of funding.{" "}
          <a href="#" className="font-semibold text-cyan-600">
            <span aria-hidden="true" className="absolute inset-0" />
            Read more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Welcome To Greenwich Theatre
        </h1>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-lg/8">
          Greenwich Theatre is one of London&apos;s foremost Off-West End
          theatres, working on a local, national and international stage. From
          presenting an enviable year-round programme of established and
          emerging theatre here in the Royal borough of Greenwich, to supporting
          artists in taking their work around the world, the development of new
          work is always at the heart of what we do. Combined with our
          nationally regarded programme of theatre for children and young people
          and our award-winning pantomime, Greenwich Theatre continues to
          contribute to this country&apos;s dynamic, diverse, vibrant theatre
          ecology, treating the audiences of today to a glimpse of some of the
          biggest theatre-makers of tomorrow.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/events"
            className="rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            Browse Plays
          </Link>
          <Link to="/about" className="text-sm/6 font-semibold text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Home;
