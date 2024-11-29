import Link from "next/link";
import "@/styles/arrow.css"; // Import the regular CSS file

const ExploreMoreArrow = () => {
  return (
    <div className="explore-more-arrow m-5">
      <Link href="/blog/all" className="explore-link">
        <div className="main">
          <span className="text-2xl font-bold text-gray-600 hover:text-gray-500 translateX(10px) transition duration-300 ease-in-out move-on-hover">
            Explore More &gt;&gt;&gt;
          </span>
          <div className="the-arrow -right">
            <div className="shaft"></div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ExploreMoreArrow;
