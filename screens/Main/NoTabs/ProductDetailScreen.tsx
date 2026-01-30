import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {
  Box,
  StarHalf,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleUser,
  Heart,
  IndianRupee,
  List,
  Share2,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Play,
  ThumbsUp,
  ArrowRight,
} from 'lucide-react-native';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation, useRoute } from '@react-navigation/native';
import userStore from '../../../store/MyStore';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

/* ================= SKELETON ================= */

const SkeletonBox = ({ w, h, r = 6, style }) => (
  <View
    style={{
      width: w,
      height: h,
      borderRadius: r,
      backgroundColor: '#e5e7eb',
      overflow: 'hidden',
      ...(style || {}),
    }}
  />
);

const ProductDetailSkeleton = () => (
  <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
    <SkeletonBox w={width} h={420} r={0} />
    <View style={{ padding: 16, gap: 12 }}>
      <SkeletonBox w={120} h={18} />
      <SkeletonBox w={width * 0.8} h={24} />
      <SkeletonBox w={width * 0.5} h={24} />
      <SkeletonBox w={width * 0.9} h={80} />
      <SkeletonBox w={width * 0.9} h={60} />
    </View>
  </View>
);

/* ================= HEADER ================= */

const CollapsableHeader = ({ navigation, title = "Product" }) => {
  return (
    <View
      style={{
        width,
        height: 95,
        paddingTop: 40,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        

        // subtle shadow for premium feel
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,

        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: "#f9fafb",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <ChevronLeft size={20} color="#111827" />
        </TouchableOpacity>

        {/* TITLE */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#111827",
            letterSpacing: 0.3,
          }}
        >
          {title}
        </Text>

        {/* RIGHT PLACEHOLDER (keeps center alignment) */}
        <View style={{ width: 38 }} />
      </View>
    </View>
  );
};

/* ================= IMAGE SLIDER ================= */

const ProductImageSlider = ({ images = [], rating, totalSoldOut }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomVisible, setIsZoomVisible] = useState(false);

  const flatListRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const zoomImages = images.map(img => ({ url: img }));

  if (!images.length) return null;

  return (
    <View style={{ backgroundColor: '#fff', position: 'relative' }}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsZoomVisible(true)}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: 'rgba(17,24,39,0.7)',
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: '#f9fafb',
            fontWeight: '600',
          }}
        >
          {activeIndex + 1} / {images.length}
        </Text>
      </View>

      <View
        style={{
          ...styles.dotsContainer,
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
        }}
      >
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: activeIndex === index ? 14 : 6,
                borderRadius: 999,
                backgroundColor:
                  activeIndex === index
                    ? '#fbbf24'
                    : 'rgba(229,231,235,0.7)',
              },
            ]}
          />
        ))}
      </View>

      <Modal
        isVisible={isZoomVisible}
        style={{ margin: 0, backgroundColor: '#000' }}
        onBackdropPress={() => setIsZoomVisible(false)}
        onBackButtonPress={() => setIsZoomVisible(false)}
      >
        <ImageViewer
          imageUrls={zoomImages}
          index={activeIndex}
          enableSwipeDown
          onSwipeDown={() => setIsZoomVisible(false)}
          backgroundColor="#000"
          enablePreload
        />
      </Modal>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.57)',
          
          borderTopRightRadius : 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >

        <View style = {{flexDirection :'row' , alignItems : 'center' , gap : 2 }}>
<RatingStars rating={rating}  size = {10}  color = {'#ffbf00ff'}/>
<Text style = {{fontSize : 12 , color : '#000000ff' }}> {rating} </Text>
        </View>
        
         
        <View
          style={{
            width: 1,
            height: 14,
            backgroundColor: 'rgba(156,163,175,0.7)',
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          
          <Text
            style={{
              fontSize: 12,
              color: '#000000ff',
              fontWeight: '500',
            }}
          >
            {totalSoldOut < 1000 ? totalSoldOut  + " Sold": totalSoldOut/1000 + "K Sold"}
          </Text>
        </View>
      </View>
    </View>
  );
};

/* ================= RATING STARS ================= */

const RatingStars = ({ rating, size = 18, color = '#ff7300ff' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} size={size} color={color} fill={color} />
      ))}

      {halfStar && (
        <View style={{ width: size, height: size }}>
          <Star
            size={size}
            color={color}
            fill="none"
            style={StyleSheet.absoluteFill}
          />
          <StarHalf
            size={size}
            color={color}
            fill={color}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          size={size}
          color={color}
          fill="none"
        />
      ))}
    </View>
  );
};


const RatingOrRateButton = ({
  variant,
  Product,
  navigation,
  productId,
  varientId,
  width,
}) => {
  const hasNoRatingData =
    !variant?.ratingMap?.length &&
    !variant?.rating &&
    !Product?.TotalReviews &&
    !Product?.OverAllRatingMap?.length;

  if (hasNoRatingData) {
    return (
      <RateButton
        navigation={navigation}
        productId={variant?.Parent || productId}
        variantId={variant?.id || varientId}
        width={width}
      />
    );
  }

  return (
    <RatingSection
      RatingMap={variant?.ratingMap || []}
      VarientRating={variant?.rating}
      OverallRating={Product?.TotalReviews}
      OverAllRatingMap={Product?.OverAllRatingMap || []}
    />
  );
};

const RateButton = ({ navigation, productId, variantId, width }) => (
  <View
    style={{
      paddingVertical: 1,
      backgroundColor: '#ffffffff',
      width,
      alignItems: 'center',
    }}
  >
    <View style={{ width: width * 0.89, paddingVertical: 14 }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: '#2563eb',
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
        onPress={() => {
          navigation.navigate('RateProduct', {
            productId,
            variantId,
          });
        }}
      >
        <Star size={20} color="#fff" fill="#fbbf24" />
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
          Be the first to rate
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RatingSection = ({
  RatingMap = [],
  VarientRating,
  OverallRating,
  OverAllRatingMap = [],
}) => {
  const [ratingStatus, setRatingStatus] = useState('Varient');
  const colorArray = ['#22c55e', '#4ade80', '#facc15', '#fb923c', '#f97373'];

  const ratingBarArray = RatingMap.map((item, index) => ({
    ...item,
    color: colorArray[index] ?? colorArray[colorArray.length - 1],
  }));

  const overAllRatingMapArray = OverAllRatingMap.map((item, index) => ({
    ...item,
    color: colorArray[index] ?? colorArray[colorArray.length - 1],
  }));

  const activeRatingBars =
    ratingStatus === 'Varient' ? ratingBarArray : overAllRatingMapArray;

  const activeRating =
    ratingStatus === 'Varient' ? VarientRating : OverallRating;

  return (
    <View
      style={{
        paddingVertical: 1,
        backgroundColor: '#ffffffff',
        width,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: width * 0.89,
          paddingVertical: 14,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#111827',
              }}
            >
              Ratings & Reviews
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
                marginTop: 2,
              }}
            >
              See what people think
            </Text>
          </View>

          <View
            style={{
              borderRadius: 999,
              flexDirection: 'row',
              padding: 3,
              backgroundColor: '#e5e7eb',
            }}
          >
            <TouchableOpacity
              onPress={() => setRatingStatus('Varient')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor:
                  ratingStatus === 'Varient' ? '#fff' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color:
                    ratingStatus === 'Varient' ? '#111827' : '#6b7280',
                }}
              >
                Variant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRatingStatus('Overall')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor:
                  ratingStatus === 'Overall' ? '#fff' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color:
                    ratingStatus === 'Overall' ? '#111827' : '#6b7280',
                }}
              >
                Overall
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '40%',
              alignItems: 'center',
              paddingRight: 10,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '800',
                  color: '#111827',
                }}
              >
                {activeRating?.toFixed
                  ? activeRating.toFixed(1)
                  : activeRating}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginLeft: 2,
                  marginBottom: 4,
                }}
              >
                /5
              </Text>
            </View>

            <View style={{ marginTop: 4 }}>
              <RatingStars rating={activeRating} size={18} />
            </View>

            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
                marginTop: 4,
              }}
            >
              428 ratings · 86 reviews
            </Text>
          </View>

          <View style={{ width: '55%', marginTop: 3 }}>
            {activeRatingBars.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 3,
                }}
              >
                <View
                  style={{
                    width: 32,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      color: '#9ca3af',
                      marginLeft: 1,
                    }}
                  >
                    ★
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: '#e5e7eb',
                    overflow: 'hidden',
                    marginHorizontal: 6,
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${Number(item.subtitle)}%`,
                      backgroundColor: item.color,
                      borderRadius: 999,
                    }}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 10,
                    color: '#6b7280',
                    minWidth: 40,
                    textAlign: 'right',
                  }}
                >
                  {item.people}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};


const QuantitySelector = ({
  quantity = 0,
  min = 0,
  max = 99,
  onIncrease,
  onDecrease
}) => {

  const increase = () => {
    if (quantity < max) onIncrease();
  };

  const decrease = () => {
    if (quantity > min) onDecrease();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#16a34a",
        borderRadius: 10,
        height: 36,
        width: 90,
        justifyContent: "space-between",
        paddingHorizontal: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <TouchableOpacity
        onPress={decrease}
        activeOpacity={0.7}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>−</Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 14,
          fontWeight: "800",
          color: "#fff",
          minWidth: 24,
          textAlign: "center",
        }}
      >
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={increase}
        activeOpacity={0.7}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};







const ProductName = ({
  data,
  
  handleWishList,
  wishList,
}) => {
  const PriceObject = data.price;

  return (
    <View
      style={{
        width,
        backgroundColor: '#ffffffd3',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: width * 0.94,
          borderRadius: 10,
          
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, gap: 2, paddingRight: 10 }}>
          <Text
            style={{
              color: '#6b7280',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontWeight: '600',
            }}
          >
            {data.brand}
          </Text>

          <Text
            style={{
              color: '#111827',
              fontSize: 14,
              fontWeight: '700',
            }}
            numberOfLines={2}
          >
            {data.name}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 4,
              marginTop: 6,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <IndianRupee size={12} color="#111827" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '800',
                  color: '#111827',
                  marginLeft: 1,
                }}
              >
                {PriceObject?.discountedPrice}
              </Text>
            </View>

            {PriceObject?.actualMRP && (
              <Text
                style={{
                  fontSize: 12,
                  color: '#858c98ff',
                  textDecorationLine: 'line-through',
                }}
              >
                {PriceObject?.actualMRP}
              </Text>
            )}

            {PriceObject?.discountPercentage ? (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: '#ecfdf5',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#16a34a',
                  }}
                >
                  {PriceObject.discountPercentage}% OFF
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              width,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'space-between',
              marginTop: 6,
            }}
          >
          </View>

         
        </View>

        {/* <View
          style={{
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={handleWishList}
            activeOpacity={0.85}
            style={{
              borderRadius: 999,
              backgroundColor: '#f9fafb',
              width: 34,
              height: 34,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Heart
              size={20}
              color="#111827"
              fill={wishList ? 'red' : 'transparent'}
            />
          </TouchableOpacity>

          
        </View> */}
      </View>
    </View>
  );
};



const ProductVarient = ({
  variants,
  selectedVariantId,
  onVariantSelect,
  
}) => {
  if (!variants?.length) return null;

  const selectedVariant = variants.find(v => v._id.toString() === selectedVariantId?.toString());

  return (
    <View
      style={{
        width: width,
        backgroundColor: '#ffffffff',
        marginVertical: 8,
        paddingVertical: 13,
        height  : 132,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
      }}
    >

      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#f3f4f6',
        }}
      >
        <View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
            Style
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
            Swipe to switch
          </Text>
        </View>

        {selectedVariant?.ProductName && (
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: '#f8fafc',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#374151',
              }}
            >
              {selectedVariant.ProductName}
            </Text>
          </View>
        )}
      </View> */}

      <FlatList
        data={variants}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 8 }}
        snapToInterval={76}
        decelerationRate="fast"
        renderItem={({ item }) => {
          const isSelected = item._id.toString() === selectedVariantId?.toString();
          const price = item.ProductAmount;
            
          return (
            <TouchableOpacity
              onPress={() => onVariantSelect(item._id)}
              activeOpacity={0.9}
              style={{ marginRight: 12, alignItems: 'center' }}
            >
              <View
                style={{
                  width: 72,
                  height: 92,
                  borderRadius: 16,
                  padding: 6,
                  borderWidth: isSelected ? 2.5 : 1,
                  borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  shadowColor: isSelected ? '#3b82f6' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.25 : 0.1,
                  shadowRadius: 12,
                  elevation: isSelected ? 6 : 0,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: '#f9fafb',
                    marginBottom: 6,
                  }}
                >
                  <Image
                    source={{ uri: item.coverImage }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 10,
                    textAlign: 'center',
                    color: isSelected ? '#1d4ed8' : '#4b5563',
                    fontWeight: isSelected ? '700' : '600',
                    paddingHorizontal: 2,
                  }}
                >
                  {item.ProductName}
                </Text>

                {price && (
                  <View
                    style={{
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6',
                      borderRadius: 6,
                      marginTop: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '700',
                        color: isSelected ? '#ffffff' : '#1f2937',
                      }}
                    >
                      ₹{price}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

/* ================= ALL DETAIL ================= */

const AllDetail = ({
  ProductDescription = [],
  ProductDetail = [],
  ReturnPolicy = {},
}) => {
  const [ProductDescriptionOpen, setProductDescriptionOpen] =
    useState(false);
  const [AllDetailOpen, setAllDetailOpen] = useState(false);

  const hasProductDescription = ProductDescription?.some(
    item => item?.title || item?.subtitle
  );
  const hasProductDetail = ProductDetail?.some(
    item => item?.title || item?.subtitle
  );

  // if (!hasProductDescription && !hasProductDetail) {
  //   return (
  //     <View
  //       style={{
  //         paddingVertical: 12,
  //         backgroundColor: '#ffffffff',
  //         width,
  //         alignItems: 'center',
  //       }}
  //     >
  //       {/* <PolicyHeader ReturnPolicy={ReturnPolicy} /> */}
  //     </View>
  //   );
  // }

  return (
    <View
      style={{
        paddingVertical: 12,
        backgroundColor: '#ffffffff',
        width,
        alignItems: 'center',
      }}
    >
      {/* <PolicyHeader ReturnPolicy={ReturnPolicy} /> */}

      <View style={{ width: width * 0.9 }}>
        {hasProductDetail && (
          <>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#111827',
                marginTop: 6,
              }}
            >
              Product information
            </Text>
            {renderAllDetailsAccordion(
              hasProductDetail,
              AllDetailOpen,
              setAllDetailOpen,
              ProductDetail
            )}
          </>
        )}

        {hasProductDescription &&
          renderProductDescriptionAccordion(
            ProductDescriptionOpen,
            setProductDescriptionOpen,
            ProductDescription
          )}
      </View>
    </View>
  );
};

const PolicyHeader = ({ ReturnPolicy = {} }) => (
  <View style={{ width: width * 0.9, marginBottom: 8 }}>
    <Text
      style={{
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
      }}
    >
      Delivery & Policy
    </Text>
    <View
      style={{
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      {ReturnPolicy?.title && (
        <View style={{ alignItems: 'center', width: '32%' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              backgroundColor: '#fee2e2',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 6,
            }}
          >
            <Box size={22} color="#ef4444" />
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: '#111827',
              textAlign: 'center',
            }}
          >
            {ReturnPolicy.title}
          </Text>
          {ReturnPolicy.subtitle && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 10,
                color: '#6b7280',
                marginTop: 2,
              }}
            >
              {ReturnPolicy.subtitle}
            </Text>
          )}
        </View>
      )}

      <View style={{ alignItems: 'center', width: '32%' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: '#dbeafe',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
          }}
        >
          <Truck size={22} color="#2563eb" />
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Cash on Delivery
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 10,
            color: '#6b7280',
            marginTop: 2,
          }}
        >
          Available
        </Text>
      </View>

      {ReturnPolicy?.title && (
        <View
          style={{ width: 1, height: 42, backgroundColor: '#e5e7eb' }}
        />
      )}

      <View style={{ alignItems: 'center', width: '32%' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: '#dcfce7',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
          }}
        >
          <Tag size={22} color="#16a34a" />
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Best Product
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 10,
            color: '#6b7280',
            marginTop: 2,
          }}
        >
          Quality assured
        </Text>
      </View>
    </View>
  </View>
);

const renderAllDetailsAccordion = (
  hasContent,
  isOpen,
  setIsOpen,
  ProductDetail
) => {
  return isOpen ? (
    <View
      style={{
        marginTop: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        onPress={() => setIsOpen(false)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 8,
              backgroundColor: '#eef2ff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shirt size={18} color="#4f46e5" />
          </View>
          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontSize: 13,
                color: '#111827',
                fontWeight: '600',
              }}
            >
              All product details
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
              }}
            >
              Color, fit, fabric & more
            </Text>
          </View>
        </View>
        <ChevronUp size={18} color="#6b7280" />
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          backgroundColor: '#e5e7eb',
          marginHorizontal: 12,
        }}
      />
      <FlatList
        data={ProductDetail}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: '48%',
              paddingVertical: 6,
              paddingHorizontal: 14,
            }}
          >
            {item?.title && (
              <Text
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                }}
              >
                {item.title}
              </Text>
            )}
            {item?.subtitle && (
              <Text
                style={{
                  fontSize: 13,
                  color: '#111827',
                  fontWeight: '500',
                  marginTop: 2,
                }}
              >
                {item.subtitle}
              </Text>
            )}
            <View
              style={{
                height: 1,
                backgroundColor: '#f3f4f6',
                marginTop: 8,
              }}
            />
          </View>
        )}
      />
    </View>
  ) : (
    <TouchableOpacity
      onPress={() => setIsOpen(true)}
      style={{
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
      >
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 8,
            backgroundColor: '#eef2ff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Shirt size={18} color="#4f46e5" />
        </View>
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontSize: 13,
              color: '#111827',
              fontWeight: '600',
            }}
          >
            All product details
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: '#6b7280',
            }}
          >
            Color, occasion & more
          </Text>
        </View>
      </View>
      <ChevronDown size={18} color="#6b7280" />
    </TouchableOpacity>
  );
};

const renderProductDescriptionAccordion = (
  isOpen,
  setIsOpen,
  ProductDescription
) => {
  return isOpen ? (
    <View
      style={{
        marginTop: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        onPress={() => setIsOpen(false)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 8,
              backgroundColor: '#fef3c7',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <List size={18} color="#d97706" />
          </View>
          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontSize: 13,
                color: '#111827',
                fontWeight: '600',
              }}
            >
              Product description
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: '#6b7280',
              }}
            >
              Manufacturing, address & more
            </Text>
          </View>
        </View>
        <ChevronUp size={18} color="#6b7280" />
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          backgroundColor: '#e5e7eb',
          marginHorizontal: 12,
        }}
      />
      <FlatList
        data={ProductDescription}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 10,
          paddingTop: 4,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: '100%',
              margin: 10,
              paddingHorizontal: 10,
            }}
          >
            {item?.title && (
              <Text
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                }}
              >
                {item.title}
              </Text>
            )}
            {item?.subtitle && (
              <Text
                style={{
                  fontSize: 13,
                  color: '#111827',
                  fontWeight: '400',
                  marginTop: 4,
                  lineHeight: 18,
                }}
              >
                {item.subtitle}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  ) : (
    <TouchableOpacity
      onPress={() => setIsOpen(true)}
      style={{
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
      >
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 8,
            backgroundColor: '#fef3c7',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <List size={18} color="#d97706" />
        </View>
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontSize: 13,
              color: '#111827',
              fontWeight: '600',
            }}
          >
            Product description
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: '#6b7280',
            }}
          >
            Manufacturing & more
          </Text>
        </View>
      </View>
      <ChevronDown size={18} color="#6b7280" />
    </TouchableOpacity>
  );
};

/* ================= REVIEW IMAGES ================= */

const MAX_VISIBLE = 4;

const ReviewImageGrid = ({ images = [], onPress = () => {} }) => {
  const visibleImages = images.slice(0, MAX_VISIBLE);
  const extraCount = images.length - (MAX_VISIBLE - 1);

  if (!images.length) {
    return null;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: '#fff',
        width,
        marginVertical: 2,
      }}
    >
      <View
        style={{
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#111827',
            }}
          >
            Customer Reviews
          </Text>

          <Text
            style={{
              fontSize: 11,
              color: '#6b7280',
            }}
          >
            {images.length} photos
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {visibleImages.map((img, index) => {
            const isLast =
              index === MAX_VISIBLE - 1 && images.length > MAX_VISIBLE;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => onPress(index)}
                style={{
                  width: '23%',
                  aspectRatio: 1,
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              >
                <Image
                  source={{ uri: img }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />

                {isLast && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '700',
                      }}
                    >
                      +{extraCount}
                    </Text>
                    <Text
                      style={{
                        color: '#e5e7eb',
                        fontSize: 10,
                        marginTop: 2,
                      }}
                    >
                      View all
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};



const BuyCard = ({
  cart,
  PricingObj,
  wishList,
  handleWishList,
  quantity,
  setCart,
  deleteCart,
  setQuantity,
  variant,
  parentId,
  VarientId,
  VarientPrice,
}) => {
  const [cartloading, setCartLoading] = useState(false);

   useEffect(()=>{
    const selectedCartItem =  cart.find(item=>item.variantId === variant.id);
    console.log(variant.id)


    console.log(selectedCartItem,"kkkkkkkkkkkkkkkkklllllllllllllllll")
    if(selectedCartItem?.quantity > 0){
      setQuantity(selectedCartItem?.quantity)
    
     
    }
   },[])
 

  const handleCartAddition = async () => {
    setCartLoading(true);

    try {
      const response = await setCart({
        productId: parentId,
        variantId: variant.id,
        coverImage: variant.coverImage,
        actualMRP: variant.pricing.actualMRP,
        discountedMRP: variant.pricing.discountedPrice,
        ProductName: variant.ProductName,
        ProductAmount: variant.ProductAmount,
        StoreAddressID: VarientId,
        StoreId: VarientId,
      });

      setQuantity(quantity + 1);

    } catch (error) {
      console.log(error);
    } finally {
      setCartLoading(false);
    }
  };

  const handleCartDeletion = async () => {
    try {
      const response = await deleteCart({
        variantId: variant.id,
        actualMRP: variant.pricing.actualMRP,
        discountedMRP: variant.pricing.discountedPrice,
      });

      setQuantity(quantity - 1)
    } catch (error) {
      console.log(error);
      return;
    }
  };

  // Calculate total price (always available)
  const totalPrice = Number(variant?.pricing?.discountedPrice || 0) * Number(quantity || 0);
  const unitPrice = Number(variant?.pricing?.discountedPrice || 0);

 return (
  <View
    style={{
      width,
      backgroundColor: "#fff",
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 10,
    }}
  >
    {PricingObj?.stock <= 0 ? (
      // ---------------- OUT OF STOCK ----------------
      <View
        style={{
          padding: 14,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleWishList}
          disabled={cartloading}
          activeOpacity={0.9}
          style={{
            width: "90%",
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#d1d5db",
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Heart
            size={18}
            fill={wishList ? "red" : "transparent"}
            color="black"
          />

          <Text
            style={{
              color: "#111827",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {wishList ? "Remove from Wishlist" : "Add to Wishlist"}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      // ---------------- IN STOCK ----------------
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT : PRICE */}
        <View style={{ flex: 1 }}>
          {quantity > 0 ? (
            <>
              <Text
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                Total payable
              </Text>

              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "900",
                    color: "#111827",
                  }}
                >
                  ₹{totalPrice.toLocaleString()}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginLeft: 6,
                  }}
                >
                  ₹{unitPrice.toLocaleString()} x {quantity}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                Price
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "900",
                  color: "#111827",
                }}
              >
                ₹{unitPrice.toLocaleString()}
              </Text>
            </>
          )}
        </View>

        {/* RIGHT : CONTROLS */}
        <View>
          {quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              max={variant.Stock}
              onIncrease={handleCartAddition}
              onDecrease={handleCartDeletion}
            />
          ) : (
            <TouchableOpacity
              onPress={handleCartAddition}
              disabled={cartloading}
              activeOpacity={0.9}
              style={{
                backgroundColor: "#16a34a",
                paddingHorizontal: 18,
                height: 40,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                shadowColor: "#16a34a",
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <ShoppingCart size={18} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "800",
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )}
  </View>
);

};

/* ================= MAIN SCREEN ================= */

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const rawParams = route.params || {};

  const productId =
    rawParams?.productId?._id ??
    rawParams?.productId ??
    rawParams?.params?.productId?._id;

  const varientId = rawParams?.varientId ?? rawParams?.params?.varientId;

  if (!productId || !varientId) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text>Invalid navigation: productId / varientId missing</Text>
      </View>
    );
  }

  const {
    loadPerticularProduct,
    cart,
    deleteWishlists,
    setCart,
    AddtoWishlists,
    deleteCart,
    totalCartItems
  } = userStore();

  const [Product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [wishList, setWishlist] = useState(false);
  const [wishListId, setWishlistId] = useState('');
   const [cartData, setCartData] = useState(cart?.slice(-4) || []);
  
    const prevCartLength = useRef(0);
  
    const popupCartValue = useSharedValue(cart?.length > 0 ? 0 : 500);
  
    const popupTranslate = useSharedValue(500);


  useEffect(() => {
    const currentLength = cart?.length || 0;
    setCartData(cart?.slice(-4) || []);

    if (currentLength > 0) {
      popupCartValue.value = withTiming(0, { duration: 300 });
    } else {
      popupCartValue.value = withTiming(500, { duration: 300 });
    }

    prevCartLength.current = currentLength;
  }, [cart]);

  const PopupCartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: popupCartValue.value }],
  }));


  const fetchProduct = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);

    try {


      const response = await loadPerticularProduct(varientId, productId);

      if (response.success) {
        setProduct(response.ParentProduct);
        setVariant(response.SelectedVariant);

        const pricing = response.SelectedVariant?.pricing || null;
        const stock = response.SelectedVariant?.Stock ?? 0;
        const priceWithStock = pricing
          ? { ...pricing, stock }
          : null;

       
        setSelectedPrice(priceWithStock);

       
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [varientId, productId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProduct(true);
  }, [varientId, productId]);

  const images = useMemo(() => {
    if (!variant) return [];
    return [variant.coverImage, ...(variant.images || [])];
  }, [variant]);

  const handleWishList = async () => {
    try {
      if (!wishList) {
        const res = await AddtoWishlists(
          productId,
          varientId,
          variant?.ProductAmount || ''
        );
        if (res.success) {
          setWishlist(true);
          setWishlistId(res.wishListId);
        }
      } else {
        const res = await deleteWishlists(wishListId);
        if (res.success) {
          setWishlist(false);
          setWishlistId('');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };



  if (isLoading || !Product || !variant || !selectedPrice) {
    return (
      <View style={{ flex: 1 }}>
        <ProductDetailSkeleton />
      </View>
    );
  }



  const Components = [
    {
      id: 'image-slider',
      render: () => (
        <ProductImageSlider
          images={images}
          rating={variant.rating}
          totalSoldOut={variant.totalSold}
        />
      ),
    },
    {
      id: 'product-name',
      render: () => (
        <ProductName
          data={{
            name: variant.ProductName,
            brand: Product.BrandName,
            price: selectedPrice,
          }}
          wishList={wishList}
          handleWishList={handleWishList}
          
        />
      ),
    },
    {
      id: 'variant-section',
      render: () => (
        <ProductVarient
          variants={Product.Variants}
          selectedVariantId={variant.id}
          onVariantSelect={newVariantId => {
            navigation.replace('ProductDetail', {
              productId,
              varientId: newVariantId,
            });
          }}

          
        />
      ),
    },
    {
      id: 'all-detail',
      render: () => (
        <AllDetail
          ProductDescription={Product.ProductDescription}
          ProductDetail={Product.ProductDetail}
          ReturnPolicy={Product.ReturnPolicy}
        />
      ),
    },
    {
      id: 'review-images',
      render: () => (
        <ReviewImageGrid images={Product.ReviewImages || []} />
      ),
    },
   
  ];

  return (
    <View style={{ flex: 1 }}>
      <CollapsableHeader navigation={navigation} />

      <FlatList
        data={Components}
        keyExtractor={item => item.id}
        renderItem={({ item }) => item.render()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />


          <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 80,
              alignSelf: 'center',
              backgroundColor: '#16a34a',
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 12,
            },
            PopupCartAnimatedStyle,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Screens' , {
              screen : 'ViewCartScreen'
            })}


            style={{
              width: width * 0.6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Product Preview Stack */}
            <FlatList
              data={cartData}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 2 }}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    borderWidth: 1.5,
                    borderColor: '#fff',
                    marginLeft: index === 0 ? 0 : -12,
                  }}
                >
                  {item?.coverImage ? (
                    <Image
                      source={{ uri: item.coverImage }}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#e5e7eb',
                      }}
                    />
                  )}
                </View>
              )}
            />

            {/* Cart Info */}
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '700',
                  lineHeight: 14,
                }}
              >
                {totalCartItems} item
                {totalCartItems > 1 ? 's' : ''}
              </Text>

              <Text
                style={{
                  color: '#dcfce7',
                  fontSize: 11,
                  fontWeight: '600',
                }}
              >
                View Cart
              </Text>
            </View>

            {/* Arrow */}
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowRight size={16} color="#16a34a" />
            </View>
          </TouchableOpacity>
        </Animated.View>



      <BuyCard
      cart = {cart}
        wishList={wishList}
        handleWishList={handleWishList}
        quantity={quantity}
        PricingObj={selectedPrice}
        setCart={setCart}
        setQuantity={setQuantity}
        deleteCart = {deleteCart}
        variant={variant}
        parentId={variant.Parent}
        VarientId={variant.id || variant._id}
        VarientPrice={selectedPrice}
        
      />
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  image: {
    width,
    height: 350,
    resizeMode: 'cover',
    
    backgroundColor: '#fff',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  Quantitycontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    width: 110,
    height: 36,
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  countBox: {
    flex: 1,
    alignItems: 'center',
  },
  count: {
    fontSize: 16,
    fontWeight: '500',
  },
});
