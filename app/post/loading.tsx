import { SkeletonTheme } from "react-loading-skeleton";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
export default function Loading(){
    return (
      <div className="flex justify-center items-center h-screen">
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5" width={420}>
            <div className="space-y-4">
              {/* Title Skeleton */}
              <div>
                <Skeleton width={120} height={30} />
                <Skeleton height={40} />
              </div>
 
              {/* Description Skeleton */}
              <div>
                <Skeleton width={80} height={30} />
                <Skeleton height={80} />
              </div>
 
              {/* Image Upload Skeleton */}
              <div>
                <Skeleton width={80} height={30} />
                <Skeleton height={40} />
              </div>
 
              {/* Submit Button Skeleton */}
              <div>
                <Skeleton height={50} />
              </div>
            </div>
          </SkeletonTheme>
      </div>
  );
}
