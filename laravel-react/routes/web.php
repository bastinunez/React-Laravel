<?php

use App\Http\Controllers\DireccionController;
use App\Http\Controllers\DocumentoAnexoController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\FuncionarioController;
use App\Http\Controllers\GestionDocumentoController;
use App\Http\Controllers\GestionUsuarioController;
use App\Http\Controllers\HistorialAccionFormularioController;
use App\Http\Controllers\HistorialAccionUsuarioController;
use App\Http\Controllers\HistorialDocumentosAnexosController;
use App\Http\Controllers\HistorialDocumentosController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProfileController;
use App\Models\Funcionario;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest');

Route::get('/registro', function () {
    return Inertia::render('Auth/Register');
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    //DOCUMENTOS
    Route::post('documento-anexo', [DocumentoController::class, 'store_anexo'])->name('documento.store_anexo');
    Route::resource('documento', DocumentoController::class)->names('documento');
    Route::get('/api/all-documents', [DocumentoController::class, 'get_all']);
    Route::get('/api/all-documents/{id}', [DocumentoController::class, 'get_all_less_one']);
    Route::get('/api/documentos-anexos/{id}', [DocumentoController::class, 'get_doc_anexos']);
    Route::get('/documento/visualizar/{mensaje}', [DocumentoController::class, 'visualizar'])->name('documento.visualizar');
    Route::post('documento-anular', [DocumentoController::class, 'anular'])->name('documento.anular');
    Route::post('documento-habilitar', [DocumentoController::class, 'habilitar'])->name('documento.habilitar');
    Route::post('documento-descargar', [DocumentoController::class, 'descargar'])->name('documento.descargar');

    
    Route::patch('/gestion-documento/update-collection/{mensaje}',[GestionDocumentoController::class,'updateCollection'])->name('gestion-documento.update-collection');
    Route::resource('gestion-documento', GestionDocumentoController::class)->names('gestion-documento');
    Route::post('/documento-anexo/agregar-existente', [DocumentoAnexoController::class, 'store_existent'])->name('documento-anexo.agregar-existente');
    Route::resource('/documento-anexo', DocumentoAnexoController::class)->names('documento-anexo');


    //FUNCIONARIOS
    Route::resource('/funcionario', FuncionarioController::class)->names('funcionario');


    //DIRECCIONES
    Route::resource('/direccion', DireccionController::class)->names('direccion');


    //USUARIOS
    Route::resource('usuario', UsuarioController::class);
    Route::post('/usuarios/editar-datos', [UsuarioController::class, 'edit_data'])->name('usuario.edit_data');
    Route::post('/usuarios/editar', [UsuarioController::class, 'update_pwd'])->name('usuario.update_pwd');
    Route::get('/api/find-user/{id}', [GestionUsuarioController::class, 'get_user']);
    Route::patch('/gestion-usuarios/update-metadata/{id}',[GestionUsuarioController::class,'edit_user_metadata'])->name('gestion-usuarios.update-metadata');
    Route::patch('/gestion-usuarios/update-collection/{mensaje}',[GestionUsuarioController::class,'updateCollection'])->name('gestion-usuarios.update-collection');
    Route::patch('/gestion-usuarios/update-permission/{mensaje}',[GestionUsuarioController::class,'updatePermission'])->name('gestion-usuarios.update-permission');
    Route::resource('/gestion-usuarios', GestionUsuarioController::class)->names('gestion-usuarios');


    //HISTORIAL
    Route::resource('historial-documentos', HistorialDocumentosController::class)->names('historial-documentos');
    Route::resource('historial-documentos-anexos', HistorialDocumentosAnexosController::class)->names('historial-documentos-anexos');
    Route::resource('historial-accion-usuario', HistorialAccionUsuarioController::class)->names('historial-accion-usuario');
    Route::resource('historial-accion-formulario', HistorialAccionFormularioController::class)->names('historial-accion-formulario');
    
  


});

//require __DIR__.'/auth.php';
