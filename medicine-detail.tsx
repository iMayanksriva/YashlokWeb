import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Plus, Minus, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type MedicineWithCategory, type Review } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";

export default function MedicineDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ customerName: "", rating: 5, comment: "" });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medicine, isLoading } = useQuery<MedicineWithCategory>({
    queryKey: ["/api/medicines", id],
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: { customerName: string; rating: number; comment: string }) => {
      return apiRequest("POST", `/api/medicines/${id}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medicines", id] });
      setReviewForm({ customerName: "", rating: 5, comment: "" });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (medicine) {
      addToCart(medicine.id, quantity);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customerName.trim() || !reviewForm.comment.trim()) {
      toast({
        title: "Invalid input",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    submitReviewMutation.mutate(reviewForm);
  };

  const renderStars = (rating: string | number, interactive = false, onRatingChange?: (rating: number) => void) => {
    const ratingNum = typeof rating === "string" ? parseFloat(rating) : rating;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= ratingNum
              ? "fill-current text-amber-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`}
          onClick={interactive && onRatingChange ? () => onRatingChange(i) : undefined}
        />
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Medicine not found</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stockStatus = medicine.stockCount === 0 ? "Out of Stock" : 
                     medicine.stockCount <= (medicine.stockThreshold || 10) ? "Low Stock" : "In Stock";
  
  const stockColor = medicine.stockCount === 0 ? "destructive" :
                     medicine.stockCount <= (medicine.stockThreshold || 10) ? "amber-500" : "accent";

  return (
    <div className="min-h-screen bg-background">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link href={`/category/${medicine.category.slug}`} className="text-muted-foreground hover:text-primary transition-colors">
            {medicine.category.name}
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{medicine.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="space-y-4">
            <img
              src={medicine.imageUrl || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"}
              alt={medicine.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{medicine.category.name}</Badge>
                <Badge variant={stockColor === "accent" ? "default" : "destructive"}>
                  {stockStatus}
                </Badge>
                {medicine.requiresPrescription === 1 && (
                  <Badge variant="outline">Prescription Required</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{medicine.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{medicine.description}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {renderStars(medicine.averageRating)}
                </div>
                <span className="ml-2 text-muted-foreground">
                  {medicine.averageRating} ({medicine.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-foreground">₹{medicine.price}</span>
                {medicine.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">₹{medicine.originalPrice}</span>
                )}
              </div>

              {/* Stock Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Stock Level:</span>
                  <span className={`text-sm font-medium ${stockColor === "accent" ? "text-accent" : stockColor === "amber-500" ? "text-amber-600" : "text-destructive"}`}>
                    {medicine.stockCount} units available
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stockColor === "accent" ? "bg-accent" : stockColor === "amber-500" ? "bg-amber-500" : "bg-destructive"}`}
                    style={{ width: `${Math.min((medicine.stockCount / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="quantity">Quantity:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={medicine.stockCount}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(medicine.stockCount, quantity + 1))}
                    disabled={quantity >= medicine.stockCount}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={medicine.stockCount === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicine.manufacturer && (
                  <div>
                    <Label className="font-semibold">Manufacturer:</Label>
                    <p className="text-muted-foreground">{medicine.manufacturer}</p>
                  </div>
                )}
                {medicine.composition && (
                  <div>
                    <Label className="font-semibold">Composition:</Label>
                    <p className="text-muted-foreground">{medicine.composition}</p>
                  </div>
                )}
                {medicine.dosage && (
                  <div>
                    <Label className="font-semibold">Dosage:</Label>
                    <p className="text-muted-foreground">{medicine.dosage}</p>
                  </div>
                )}
                {medicine.packSize && (
                  <div>
                    <Label className="font-semibold">Pack Size:</Label>
                    <p className="text-muted-foreground">{medicine.packSize}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews ({medicine.reviewCount})</CardTitle>
              </CardHeader>
              <CardContent>
                {medicine.reviews && medicine.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {medicine.reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.customerName}</span>
                            {review.isVerified === 1 && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="flex text-amber-400">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                )}
              </CardContent>
            </Card>

            {/* Add Review */}
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Your Name</Label>
                    <Input
                      id="customerName"
                      value={reviewForm.customerName}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, customerName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <div className="flex text-amber-400 mt-1">
                      {renderStars(reviewForm.rating, true, (rating) => 
                        setReviewForm(prev => ({ ...prev, rating }))
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this medicine..."
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitReviewMutation.isPending}>
                    {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Genuine medicines only</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Licensed pharmacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Free delivery above ₹500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">24/7 customer support</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions about this medicine? Our licensed pharmacists are here to help.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Pharmacist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
