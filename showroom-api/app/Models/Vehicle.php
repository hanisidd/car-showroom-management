<?php namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Model as CarModel;

class Vehicle extends EloquentModel
{
    use HasFactory;

    protected $fillable = [
        'make_id',
        'model_id',
        'fuel_type_id',
        'body_type_id', // Added
        'year',
        'price',
        'condition',
        'body_type',
        'transmission',
        'exterior_color',
        'interior_color',
        'mileage',
        'vin',
        'lot_number',
        'description',
        'status',
    ];

    public function make(): BelongsTo { return $this->belongsTo(Make::class); }
    public function model(): BelongsTo { return $this->belongsTo(CarModel::class, 'model_id'); }
    public function fuelType(): BelongsTo { return $this->belongsTo(FuelType::class, 'fuel_type_id'); }
    public function bodyType(): BelongsTo { return $this->belongsTo(BodyType::class, 'body_type_id'); }
    public function images(): HasMany { return $this->hasMany(VehicleImage::class)->orderBy('sort_order', 'asc'); }
}