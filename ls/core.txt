(def cons
 (fn (:x :y :z)
   (:z :x :y)))

(def car
 (fn (:z)
   (:z (fn (:x :y) :x))))

(def cdr
 (fn (:z)
  (:z (fn (:x :y) :y))))

(def nil
 (fn (:f :x) :x))

(def nil?
 (fn (:n)
   (:n (fn (:x) cdr) car)))
